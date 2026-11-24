# Laravel 12 Search Architecture Enhancement (SEARCH_ENHANCEMENT.md)

## 1. Problem Statement & Audit Findings

The current Laravel backend search at `admin.totthobox.com/api/search` exhibits the following limitations:
1. **No Banglish / Phonetic Matching:** Queries in English/Banglish (e.g. `japan`, `avro`, `dollar`, `boyos`, `jomi`, `999`) return 0 results because database queries rely on exact Bangla substring matching (`LIKE '%query%'`).
2. **Missing Tool / Utility Index:** Only database-persisted entities (such as articles, establishments, and tourist spots) are indexed; core utility services and calculators are absent from backend search results.
3. **No Character Normalization:** Variations in Unicode Bangla characters (such as `য়` vs `য়`, `ড়` vs `ড়`, `ঢ়` vs `ঢ়`, Zero-Width Non-Joiner `\u200C`, and hasanta) cause missed search hits.
4. **No Typo Tolerance:** A single misspelled character yields 0 results.

---

## 2. Recommended Solution: Laravel Scout + Meilisearch

Meilisearch provides native out-of-the-box typo-tolerance, prefix search, and multi-language tokenization. It integrates seamlessly with Laravel 12 via official Laravel Scout.

### Step 1: Install Dependencies
```bash
composer require laravel/scout
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

### Step 2: Configure `.env`
```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=your_meilisearch_master_key
```

### Step 3: Bangla Text Normalizer Helper
Create `app/Services/BanglaTextNormalizer.php`:
```php
<?php

namespace App\Services;

class BanglaTextNormalizer
{
    /**
     * Normalize Bangla unicode variations and remove zero-width characters.
     */
    public static function normalize(string $text): string
    {
        $text = mb_strtolower($text, 'UTF-8');
        
        // Remove Zero-Width Non-Joiner and Zero-Width Joiner
        $text = str_replace(["\xE2\x80\x8C", "\xE2\x80\x8D", "\xEF\xBB\xBF"], '', $text);
        
        // Normalize nukta variants
        $map = [
            'ড়' => 'ড়',
            'ঢ়' => 'ঢ়',
            'য়' => 'য়',
        ];
        
        return strtr($text, $map);
    }

    /**
     * Common Banglish phonetic transliteration mapping for high-intent keywords
     */
    public static function transliterateBanglish(string $query): string
    {
        $dictionary = [
          'boyos' => 'বয়স',
          'boyosh' => 'বয়স',
          'age' => 'বয়স',
          'jomi' => 'জমি',
          'land' => 'জমি',
          'taka' => 'টাকা',
          'dollar' => 'ডলার',
          'dolar' => 'ডলার',
          'chuti' => 'ছুটি',
          'holiday' => 'ছুটি',
          'calendar' => 'ক্যালেন্ডার',
          'avro' => 'অভ্র',
          'bijoy' => 'বিজয়',
          'emergency' => 'জরুরি',
          'police' => 'পুলিশ',
          'ambulance' => 'অ্যাম্বুলেন্স',
          'desh' => 'দেশ',
          'country' => 'দেশ',
          'vromon' => 'ভ্রমণ',
          'tourism' => 'পর্যটন',
        ];

        $lower = strtolower(trim($query));
        return $dictionary[$lower] ?? $query;
    }
}
```

---

## 3. Model Search Configuration

Add the `Laravel\Scout\Searchable` trait to all content models.

### Example: `App\Models\TouristSpot.php`
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use App\Services\BanglaTextNormalizer;

class TouristSpot extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => BanglaTextNormalizer::normalize($this->title),
            'title_en' => $this->title_en,
            'district' => $this->district,
            'division' => $this->division,
            'summary' => BanglaTextNormalizer::normalize($this->summary ?? ''),
            'keywords' => $this->keywords ?? [],
        ];
    }
}
```

Repeat for:
- `App\Models\Establishment`
- `App\Models\PublicFigure`
- `App\Models\History`
- `App\Models\IslamicArticle`
- `App\Models\Holiday`

---

## 4. Real-time Model Observers for Auto-Indexing

Ensure changes made in the admin panel automatically sync with the search index.

Create `app/Observers/SearchIndexObserver.php`:
```php
<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;

class SearchIndexObserver
{
    public function saved(Model $model): void
    {
        if (method_exists($model, 'searchable')) {
            $model->searchable();
        }
    }

    public function deleted(Model $model): void
    {
        if (method_exists($model, 'unsearchable')) {
            $model->unsearchable();
        }
    }
}
```

Register in `app/Providers/AppServiceProvider.php`:
```php
use App\Models\TouristSpot;
use App\Models\Establishment;
use App\Models\PublicFigure;
use App\Models\History;
use App\Observers\SearchIndexObserver;

public function boot(): void
{
    TouristSpot::observe(SearchIndexObserver::class);
    Establishment::observe(SearchIndexObserver::class);
    PublicFigure::observe(SearchIndexObserver::class);
    History::observe(SearchIndexObserver::class);
}
```

---

## 5. Unified Controller Implementation

Update `app/Http/Controllers/Api/SearchController.php`:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BanglaTextNormalizer;
use App\Models\TouristSpot;
use App\Models\Establishment;
use App\Models\PublicFigure;
use App\Models\History;
use App\Models\Holiday;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $rawQuery = trim($request->input('q', ''));
        $limit = min((int) $request->input('limit', 10), 50);

        if (mb_strlen($rawQuery) < 2) {
            return response()->json([
                'items' => [],
                'scope' => null,
                'hasMore' => false,
                'total' => 0,
            ]);
        }

        // Transliterate Banglish keywords to Bangla
        $query = BanglaTextNormalizer::transliterateBanglish($rawQuery);
        $normalized = BanglaTextNormalizer::normalize($query);

        $results = [];

        // Example Scout multi-model query or combined index
        $touristSpots = TouristSpot::search($normalized)->take($limit)->get();
        foreach ($touristSpots as $spot) {
            $results[] = [
                '_search_title' => $spot->title,
                '_search_subtitle' => mb_substr(strip_tags($spot->summary), 0, 120) . '...',
                '_search_label' => 'পর্যটন',
                '_search_url' => "https://totthobox.com/bangladesh/tourism/{$spot->slug}",
                '_search_image' => $spot->thumbnail_url ?? null,
                '_search_icon' => 'map-pin',
                '_search_color' => 'sky',
                '_search_type' => 'tourism',
                '_search_slug' => $spot->slug,
            ];
        }

        // Repeat for Establishment, PublicFigure, History...

        $sliced = array_slice($results, 0, $limit);

        return response()->json([
            'items' => $sliced,
            'scope' => null,
            'hasMore' => count($results) > $limit,
            'total' => count($results),
        ]);
    }
}
```

---

## 6. Batch Indexing Artisan Command

To perform initial or periodic full-index builds:
```bash
php artisan scout:import "App\Models\TouristSpot"
php artisan scout:import "App\Models\Establishment"
php artisan scout:import "App\Models\PublicFigure"
php artisan scout:import "App\Models\History"
php artisan scout:import "App\Models\Holiday"
```
