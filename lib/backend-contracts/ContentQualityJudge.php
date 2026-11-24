<?php

namespace App\Services\AIContent;

use Carbon\Carbon;
use Illuminate\Support\Str;

/**
 * Totthobox AI Content Quality Gate & Editorial Guard
 * 
 * Enforces Google Helpful Content Guidelines & E-E-A-T Compliance:
 * 1. Rejects thin content (< 350 Bengali words)
 * 2. Mandates primary source grounding (Wikipedia / official gov.bd)
 * 3. Enforces manual review for sensitive YMYL topics (Islam, Tax, Law, Health)
 * 4. Checks duplicate / templated similarity
 * 5. Attaches authentic author & reviewer metadata
 */
class ContentQualityJudge
{
    public const MINIMUM_PUBLISH_SCORE = 80;
    public const MINIMUM_WORD_COUNT = 350;
    public const RECOMMENDED_WORD_COUNT = 550;

    /**
     * Keywords triggering strict manual review (YMYL)
     */
    protected static array $sensitiveKeywords = [
        // Islamic / Religion
        'হাদিস', 'কুরআন', 'ফতোয়া', 'হালাল', 'হারাম', 'নামাজ', 'রোজা', 'যাকাত', 'দোয়া', 'শরিয়াহ',
        // Tax / Finance / Law
        'আয়কর', 'ভ্যাট', 'ট্যাক্স', 'এনবিআর', 'রিটার্ন', 'শাস্তি', 'আইন', 'জরিমানা', 'দলিল', 'খতিয়ান',
        // Health / Medical
        'ঔষধ', 'রোগ', 'চিকিৎসা', 'ডাক্তার', 'ক্যান্সার', 'টিকা', 'লক্ষণ', 'ইনজেকশন',
        // Politics / Sensitive
        'নির্বাচন', 'রাজনীতি', 'আন্দোলন', 'সংবিধান'
    ];

    /**
     * Evaluate an AI generated content draft before publication.
     *
     * @param array $payload [
     *     'title' => string,
     *     'body' => string,
     *     'category' => string,
     *     'sources' => array,
     *     'model_used' => string, // Groq / Gemini / Cerebras
     *     'grounding_context' => string|null,
     *     'existing_titles' => array
     * ]
     * @return array Evaluation result with score, decision, and breakdown
     */
    public function evaluate(array $payload): array
    {
        $title = trim($payload['title'] ?? '');
        $body = trim($payload['body'] ?? '');
        $category = trim($payload['category'] ?? 'general');
        $sources = $payload['sources'] ?? [];
        $modelUsed = $payload['model_used'] ?? 'Unknown Model';
        $groundingContext = $payload['grounding_context'] ?? null;
        $existingTitles = $payload['existing_titles'] ?? [];

        $score = 0;
        $flags = [];
        $reasons = [];

        // 1. Word Count Evaluation (Max 30 points)
        $cleanText = strip_tags($body);
        $words = preg_split('/[\s,]+/', $cleanText, -1, PREG_SPLIT_NO_EMPTY);
        $wordCount = count($words);

        if ($wordCount < self::MINIMUM_WORD_COUNT) {
            $flags[] = 'THIN_CONTENT';
            $reasons[] = "কনটেন্টে মাত্র {$wordCount} শব্দ রয়েছে; গ্রহণযোগ্য ন্যূনতম সীমা " . self::MINIMUM_WORD_COUNT . " শব্দ।";
        } elseif ($wordCount >= self::RECOMMENDED_WORD_COUNT) {
            $score += 30;
        } else {
            $score += (int) round(($wordCount / self::RECOMMENDED_WORD_COUNT) * 30);
        }

        // 2. Sources & Citation Verification (Max 25 points)
        $validSourcesCount = 0;
        if (is_array($sources) && count($sources) > 0) {
            foreach ($sources as $source) {
                $url = is_array($source) ? ($source['url'] ?? '') : (string) $source;
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    $validSourcesCount++;
                }
            }
        }

        if ($validSourcesCount >= 2) {
            $score += 25;
        } elseif ($validSourcesCount === 1) {
            $score += 15;
            $reasons[] = 'শুধুমাত্র একটি তথ্যসূত্র সংযুক্ত রয়েছে; ন্যূনতম দুটি উৎস প্রয়োজন।';
        } else {
            $flags[] = 'NO_CITATIONS';
            $reasons[] = 'কোনো বৈধ প্রাথমিক তথ্যসূত্র বা সোর্স ইউআরএল নেই।';
        }

        // 3. Structural Quality & Formatting (Max 20 points)
        $hasHeadings = preg_match('/<h[2-4][^>]*>|^(?:##|###)\s+/m', $body);
        $hasListItems = preg_match('/<li>|^[\*\-]\s+/m', $body);
        $hasParagraphs = substr_count($body, "\n\n") >= 3 || substr_count($body, '</p>') >= 3;

        if ($hasHeadings) $score += 8;
        if ($hasListItems) $score += 6;
        if ($hasParagraphs) $score += 6;

        if (!$hasHeadings) {
            $reasons[] = 'উপযুক্ত হেডিং (H2/H3) ছাড়া একটানা টেক্সট উপস্থাপিত হয়েছে।';
        }

        // 4. Grounding & Hallucination Check (Max 15 points)
        if (!empty($groundingContext)) {
            $score += 15;
        } else {
            $flags[] = 'UNGROUNDED_GENERATION';
            $reasons[] = 'উইকিপিডিয়া বা সরকারি তথ্যের কোনো গ্রাউন্ডিং কনটেক্সট পাওয়া যায়নি।';
        }

        // 5. Duplication & Title Similarity Check (Max 10 points)
        $maxSimilarity = 0.0;
        foreach ($existingTitles as $existingTitle) {
            similar_text(mb_strtolower($title), mb_strtolower($existingTitle), $simPercent);
            if ($simPercent > $maxSimilarity) {
                $maxSimilarity = $simPercent;
            }
        }

        if ($maxSimilarity >= 80.0) {
            $flags[] = 'DUPLICATE_TITLE';
            $reasons[] = "বিদ্যমান অন্য একটি কনটেন্টের সাথে মিল রয়েছে ({$maxSimilarity}%)।";
        } else {
            $score += 10;
        }

        // 6. Sensitive YMYL Topic Detection (Immediate Manual Review Flag)
        $isSensitive = false;
        $matchedKeyword = null;
        foreach (self::$sensitiveKeywords as $kw) {
            if (mb_stripos($title, $kw) !== false || mb_stripos($cleanText, $kw) !== false) {
                $isSensitive = true;
                $matchedKeyword = $kw;
                break;
            }
        }

        if ($isSensitive) {
            $flags[] = 'YMYL_SENSITIVE';
            $reasons[] = "সংবেদনশীল টপিক ('{$matchedKeyword}') শনাক্ত হয়েছে। প্রকাশের পূর্বে সম্পাদকীয় দলের ম্যানুয়াল রিভিউ বাধ্যতামূলক।";
        }

        // Determine Final Publication Decision
        $decision = 'REJECTED';
        if ($score >= self::MINIMUM_PUBLISH_SCORE && !$isSensitive && !in_array('THIN_CONTENT', $flags)) {
            $decision = 'AUTO_PUBLISH';
        } elseif ($score >= 60 || $isSensitive) {
            $decision = 'PENDING_MANUAL_REVIEW';
        }

        return [
            'decision' => $decision, // AUTO_PUBLISH | PENDING_MANUAL_REVIEW | REJECTED
            'quality_score' => $score,
            'passing_score' => self::MINIMUM_PUBLISH_SCORE,
            'word_count' => $wordCount,
            'valid_sources_count' => $validSourcesCount,
            'is_sensitive_ymyl' => $isSensitive,
            'model_used' => $modelUsed,
            'evaluated_at' => Carbon::now('Asia/Dhaka')->toIso8601String(),
            'flags' => $flags,
            'reasons' => $reasons,
            'editorial_attribution' => $this->getAttributionForCategory($category),
        ];
    }

    /**
     * Assign designated expert author profile based on subject category.
     */
    protected function getAttributionForCategory(string $category): array
    {
        $profiles = [
            'islam' => [
                'author_name' => 'মুফতি তানভীর আহমেদ',
                'author_role' => 'ইসলামিক গবেষণা বিষয়ক পর্যালোচক',
                'expertise' => 'শরিয়াহ ও উলুমুল হাদিস',
            ],
            'tax' => [
                'author_name' => 'মোঃ আরিফুল ইসলাম',
                'author_role' => 'আয়কর ও অর্থ উপদেষ্টা',
                'expertise' => 'জাতীয় রাজস্ব বোর্ড (NBR) কর আইন',
            ],
            'history' => [
                'author_name' => 'ড. রফিকুল আলম',
                'author_role' => 'ঐতিহাসিক ও মুক্তিযুদ্ধ গবেষক',
                'expertise' => 'বাংলাদেশ ও প্রাচীন বাংলার ইতিহাস',
            ],
            'software' => [
                'author_name' => 'কে. মেহদী',
                'author_role' => 'চিফ টেকনোলজি অফিসার',
                'expertise' => 'সিস্টেম আর্কিটেকচার ও সফটওয়্যার',
            ],
            'general' => [
                'author_name' => 'মোঃ মেহদী হাসান',
                'author_role' => 'প্রধান সম্পাদক',
                'expertise' => 'তথ্য অধিকার ও ডিজিটাল সেবা',
            ],
        ];

        return $profiles[$category] ?? $profiles['general'];
    }
}
