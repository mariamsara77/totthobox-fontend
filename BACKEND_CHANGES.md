# Backend (Laravel API) Architecture & Recommendations

This document outlines the required and recommended changes in the Laravel backend API (`https://admin.totthobox.com`) to support ultra-fast Next.js caching, instant cache invalidation, automated sitemaps, and full Google AdSense compliance.

---

## 1. On-Demand ISR Cache Invalidation Hook

Next.js provides an on-demand revalidation endpoint at:
`POST https://totthobox.com/api/revalidate`

### Authentication:
Header: `x-revalidate-secret: <REVALIDATE_SECRET>`

### Payload Formats:
By Cache Tag (recommended):
```json
{
  "tag": "history"
}
```
Or for a specific record:
```json
{
  "tag": "history:shat-gombuj-masjid"
}
```
Or by route path:
```json
{
  "path": "/bangladesh/history/shat-gombuj-masjid",
  "type": "page"
}
```

### Laravel Implementation (Model Observer):
Create an Eloquent Observer in Laravel: `app/Observers/ContentCacheObserver.php`:

```php
namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContentCacheObserver
{
    protected string $revalidateUrl;
    protected string $secret;

    public function __construct()
    {
        $this->revalidateUrl = config('services.frontend.revalidate_url', 'https://totthobox.com/api/revalidate');
        $this->secret = config('services.frontend.revalidate_secret', env('REVALIDATE_SECRET'));
    }

    public function saved(Model $model): void
    {
        $this->purgeCache($model);
    }

    public function deleted(Model $model): void
    {
        $this->purgeCache($model);
    }

    protected function purgeCache(Model $model): void
    {
        $tag = $this->resolveTag($model);
        if (!$tag) return;

        try {
            Http::withHeaders([
                'x-revalidate-secret' => $this->secret,
                'Accept' => 'application/json',
            ])->timeout(3)->post($this->revalidateUrl, [
                'tag' => $tag,
            ]);
        } catch (\Throwable $e) {
            Log::warning("Failed to purge Next.js ISR cache for tag: {$tag}", [
                'error' => $e->getMessage()
            ]);
        }
    }

    protected function resolveTag(Model $model): ?string
    {
        $class = class_basename($model);
        return match ($class) {
            'Holiday' => 'holiday',
            'History' => 'history',
            'Tourism' => 'tourism',
            'Establishment' => 'establishment',
            'Introduction' => 'introduction',
            'Person' => 'public-figure',
            'IslamBasic' => 'islam-basic',
            'Dowan' => 'islam-dowan',
            'Sign' => 'signs',
            'App' => 'software',
            'Contact' => 'contacts',
            'News' => 'news',
            default => null,
        };
    }
}
```

Register this observer in `app/Providers/EventServiceProvider.php`:
```php
public function boot(): void
{
    Holiday::observe(ContentCacheObserver::class);
    History::observe(ContentCacheObserver::class);
    Tourism::observe(ContentCacheObserver::class);
    Establishment::observe(ContentCacheObserver::class);
    Introduction::observe(ContentCacheObserver::class);
    Person::observe(ContentCacheObserver::class);
    IslamBasic::observe(ContentCacheObserver::class);
    Dowan::observe(ContentCacheObserver::class);
    Sign::observe(ContentCacheObserver::class);
    App::observe(ContentCacheObserver::class);
}
```

---

## 2. Fast Sitemap Data Endpoint (`/api/sitemap-data`)

Currently, building the full sitemap requires paginating through 9+ different endpoints. We recommend providing a lightweight aggregated endpoint:

**Route:** `GET /api/sitemap-data`

### Expected JSON Response:
```json
{
  "success": true,
  "data": {
    "holidays": [
      { "slug": "shaheed-day", "updated_at": "2026-02-21T00:00:00Z" }
    ],
    "history": [
      { "slug": "shat-gombuj-masjid", "updated_at": "2026-01-15T10:00:00Z" }
    ],
    "tourism": [
      { "slug": "sajek-valley", "updated_at": "2026-03-01T12:00:00Z" }
    ],
    "establishment": [
      { "slug": "national-parliament", "updated_at": "2026-01-10T08:00:00Z" }
    ],
    "introduction": [
      { "slug": "geography-of-bangladesh", "updated_at": "2026-02-01T09:00:00Z" }
    ],
    "public_figures": [
      { "slug": "kazi-nazrul-islam", "updated_at": "2026-01-20T11:00:00Z" }
    ],
    "islam_basic": [
      { "slug": "five-pillars-of-islam", "updated_at": "2026-02-10T14:00:00Z" }
    ],
    "islam_dowan": [
      { "slug": "sleeping-dua", "updated_at": "2026-02-12T15:00:00Z" }
    ],
    "signs": [
      { "category": "emergency", "slug": "emergency-stop", "updated_at": "2026-01-05T07:00:00Z" }
    ],
    "apps": [
      { "slug": "avro-keyboard", "updated_at": "2026-02-28T16:00:00Z" }
    ]
  }
}
```

---

## 3. Laravel Response Caching & ETag Headers

For public read-heavy endpoints, use `Cache::remember` with a 24-hour TTL:

```php
public function getHistoryDetail(string $slug)
{
    return Cache::remember("history:detail:{$slug}", 86400, function () use ($slug) {
        $item = History::where('slug', $slug)->firstOrFail();
        return response()->json([
            'success' => true,
            'data' => $item,
        ])->setEtag(md5($item->updated_at));
    });
}
```

---

## 4. Schema Enhancements for High-Value AdSense Compliance

To eliminate "Low Value Content" rejections, records need structured editorial depth. We recommend migrating the following optional fields to database tables:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `long_description` | `LONGTEXT` / `HTML` | Comprehensive 600+ word Bangla article/guide |
| `sources` | `JSON` | List of reference URLs or book citations: `[{"name": "বাংলা একাডেমি", "url": "..."}]` |
| `faq` | `JSON` | Q&A entities: `[{"q": "প্রশ্ন", "a": "উত্তর"}]` |
| `author_name` | `VARCHAR(191)` | Name of author or researcher |
| `author_bio` | `VARCHAR(500)` | Short biography / credentials |
| `reviewer_name` | `VARCHAR(191)` | Name of Islamic / Legal reviewer |
| `updated_at` | `TIMESTAMP` | Explicit date of last editorial verification |
