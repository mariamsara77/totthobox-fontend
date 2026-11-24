# Totthobox — এআই কনটেন্ট নীতি ও কোয়ালিটি গেট নির্দেশিকা (AI_PUBLISHING_POLICY.md)

**তারিখ:** ১৭ নভেম্বর, ২০২৬  
**লক্ষ্য:** লারাভেল ১২ ব্যাকএন্ডে এআই জেনারেটেড আর্টিকেলের মানদণ্ড নিশ্চিতকরণ ও গুগল স্প্যাম পলিসি থেকে সাইটকে সুরক্ষা প্রদান।

---

## ১. ব্যাপক স্বয়ংক্রিয় AI পাবলিশিং বন্ধ করার কঠোর সুপারিশ (Recommendation against Bulk AI Publishing)

> ⚠️ **জরুরি সতর্কবার্তা:** গুগলের সর্বশেষ **Helpful Content System** এবং **Google Search Spam Policies (March 2024 update onwards)** অনুযায়ী, শুধুমাত্র সার্চ র‍্যাংকিং বা বিজ্ঞাপন পাওয়ার উদ্দেশ্যে বৃহৎ পরিসরে প্রোগ্রামাটিক বা এআই দিয়ে স্বয়ংক্রিয় আর্টিকেল জেনারেট করাকে **"Scaled Content Abuse"** হিসেবে গণ্য করা হয়।
> 
> কোনো ওয়েবসাইট যদি প্রতিদিন শত শত অপরীক্ষিত এআই আর্টিকেল প্রকাশ করে, তবে গুগল পুরো ডোমেইনের ইনডেক্স বাতিল (De-index) এবং গুগল অ্যাডসেন্স স্থায়ীভাবে ব্যান (AdSense Account Suspension) করে দেয়।

### Totthobox-এর জন্য অনুমোদিত টেকসই কৌশল:
1. **Bulk Publishing বন্ধ:** দিনে ৫০-১০০টি আর্টিকেল স্বয়ংক্রিয়ভাবে পাবলিশ করার পরিবর্তে সপ্তাহে ৫-১০টি মানসম্পন্ন, গভীর ও বিশেষজ্ঞ-পর্যালোচিত কনটেন্ট প্রকাশ করুন।
2. **মানসম্পন্ন টুলস ও ইউটিলিটিতে মনোযোগ:** Totthobox-এর মূল শক্তি হলো ইন্টারেক্টিভ টুলস (ক্যালকুলেটর, কনভার্টার, পঞ্জিকা)। এগুলো টেকসই ট্রাফিক আনে, যা কোনো অ্যালগরিদম আপডেটে ক্ষতিগ্রস্ত হয় না।
3. **প্রাইমারি সোর্স সাইটেশন বাধ্যতামূলক:** প্রতিটি আর্টিকেলে অবশ্যই সরকারি গেজেট, এনবিআর রুলস, ইসলামিক ফাউন্ডেশন বা স্বীকৃত পাঠ্যপুস্তকের সাইটেশন থাকতে হবে।

---

## ২. ব্যাকএন্ড কোয়ালিটি গেট সার্ভিস (`ContentQualityJudge.php`)

আমরা ব্যাকএন্ডের জন্য `App\Services\AIContent\ContentQualityJudge` সার্ভিস প্রস্তুত করেছি (`backend-changes/ContentQualityJudge.patch` ফাইলে)।

### মূল ফিল্টারসমূহ:
1. **Thin Content ফিল্টার:** আর্টিকেলে ন্যূনতম ৩০০টি খাঁটি বাংলা শব্দ না থাকলে স্বয়ংক্রিয়ভাবে বাতিল।
2. **ডুপ্লিকেট ও বাক্য পুনরাবৃত্তি চেক:** বাক্যের পুনরাবৃত্তি ১৫% এর বেশি হলে পেনাল্টি।
3. **গ্রাউন্ডিং ও সোর্স রেফারেন্স:** প্রাথমিক সোর্স অ্যারে না থাকলে কোয়ালিটি স্কোর ২০ পয়েন্ট হ্রাস পায়।
4. **সংবেদনশীল টপিক শনাক্তকরণ (YMYL):** ধর্ম (ইসলাম), স্বাস্থ্য, আইন ও রাজনীতি বিষয়ে এআই কনটেন্ট কখনো সরাসরি পাবলিশ হবে না। এটি সরাসরি `manual_review_required` স্ট্যাটাসে ড্রাফট হয়ে থাকবে।
5. **কোয়ালিটি স্কোর থ্রেশহোল্ড:** ন্যূনতম ৮০/১০০ স্কোর অর্জন না করলে আর্টিকেল পাবলিশ হবে না।

---

## ৩. লারাভেল ১২ ব্যাকএন্ডে প্যাচ প্রয়োগের নির্দেশিকা (Application Steps)

লারাভেল ব্যাকএন্ড রিপোজিটরিতে (`F:\All Project\totthobox`):

```bash
# ১. সার্ভিস ফাইলটি সরাসরি কপি করুন অথবা git apply করুন:
cp backend-changes/ContentQualityJudge.patch /path/to/laravel/
cd /path/to/laravel
git apply ContentQualityJudge.patch
```

### কিউ জবে ইনজেকশন উদাহরণ:
```php
namespace App\Jobs;

use App\Services\AIContent\ContentQualityJudge;
use App\Models\Article;

class ProcessAIArticleJob
{
    public function handle(ContentQualityJudge $judge)
    {
        $payload = [
            'title' => $this->generatedTitle,
            'content' => $this->generatedBody,
            'sources' => $this->verifiedSources,
        ];

        $evaluation = $judge->evaluate($payload, $this->category);

        if ($evaluation['status'] === ContentQualityJudge::STATUS_PASSED) {
            Article::create([
                'title' => $payload['title'],
                'content' => $payload['content'],
                'status' => 'published',
                'quality_score' => $evaluation['score'],
            ]);
        } else {
            // ড্রাফট রাখুন এবং অ্যাডমিনকে পর্যালোচনার জন্য নোটিফাই করুন
            Article::create([
                'title' => $payload['title'],
                'content' => $payload['content'],
                'status' => 'draft',
                'review_notes' => implode('; ', $evaluation['reasons']),
            ]);
        }
    }
}
```
