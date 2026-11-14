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

---

## 5. First-Party Privacy-Safe Visitor Tracking Contract

To power accurate first-party visitor statistics without third-party trackers or PII, the Laravel backend should implement three endpoints:

### 1. `POST /api/analytics/pageview`
Receives client beacon or fetch keepalive when a page is viewed.

**Request Headers:**
- `Content-Type: application/json`
- `User-Agent: <client-user-agent>`
- `X-Forwarded-For: <client-ip>`

**Request Payload Example:**
```json
{
  "visitor_id": "b3f6c8d1-4e7a-4a8b-90f1-28a1c8f42d6a",
  "session_id": "9a1e4c3b-7f2d-41a8-86d4-0b1e3f5a7c9d",
  "is_first_visit": false,
  "is_pwa": false,
  "referrer": "https://www.google.com/",
  "path": "/tools/tax-vat-calculator",
  "device_type": "mobile",
  "language": "bn-BD",
  "timestamp": 1731548400000
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Pageview recorded."
}
```

---

### 2. `POST /api/analytics/heartbeat`
Ping sent every 60s while the user's tab is actively visible (`Page Visibility API`). Used to calculate real-time "Online Now" active users.

**Request Payload Example:**
```json
{
  "visitor_id": "b3f6c8d1-4e7a-4a8b-90f1-28a1c8f42d6a",
  "session_id": "9a1e4c3b-7f2d-41a8-86d4-0b1e3f5a7c9d",
  "path": "/bangla/calendar",
  "is_pwa": true,
  "timestamp": 1731548460000
}
```

**Response:**
```json
{
  "status": "success"
}
```

---

### 3. `GET /api/analytics/stats`
Returns aggregated, real traffic counts for display on Home or About pages.

**Response Example:**
```json
{
  "status": "success",
  "data": {
    "total": "45250",
    "today": "1420",
    "online": "18",
    "pwa_users": "320",
    "period_7d": "12840",
    "period_30d": "45250"
  }
}
```

---

### Database Schema (MySQL / PostgreSQL Migration)

```sql
-- 1. Raw pageview events (partitioned or pruned after 90 days)
CREATE TABLE `analytics_pageviews` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `visitor_id` VARCHAR(64) NOT NULL,
  `session_id` VARCHAR(64) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `referrer` VARCHAR(500) NULL,
  `device_type` ENUM('mobile', 'tablet', 'desktop') NOT NULL DEFAULT 'desktop',
  `is_pwa` TINYINT(1) NOT NULL DEFAULT 0,
  `is_first_visit` TINYINT(1) NOT NULL DEFAULT 0,
  `language` VARCHAR(16) NULL,
  `ip_hash` CHAR(64) NULL COMMENT 'SHA-256 of IP + salt, no raw IP stored',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pv_visitor` (`visitor_id`),
  INDEX `idx_pv_path_created` (`path`, `created_at`),
  INDEX `idx_pv_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Real-time active sessions for "Online Now" (in-memory or short TTL)
CREATE TABLE `analytics_active_sessions` (
  `session_id` VARCHAR(64) PRIMARY KEY,
  `visitor_id` VARCHAR(64) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `is_pwa` TINYINT(1) NOT NULL DEFAULT 0,
  `last_seen_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_online_seen` (`last_seen_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Daily Aggregates table (permanent history)
CREATE TABLE `analytics_daily_aggregates` (
  `date` DATE PRIMARY KEY,
  `total_pageviews` INT UNSIGNED NOT NULL DEFAULT 0,
  `unique_visitors` INT UNSIGNED NOT NULL DEFAULT 0,
  `pwa_sessions` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### Backend Logic & Architecture Rules

1. **Online Now Calculation:**
   Count unique `visitor_id` in `analytics_active_sessions` where `last_seen_at >= NOW() - INTERVAL 3 MINUTE`.
   Prune records older than 10 minutes via scheduled task:
   ```php
   DB::table('analytics_active_sessions')->where('last_seen_at', '<', now()->subMinutes(10))->delete();
   ```

2. **Bot Filtering:**
   Discard requests if `User-Agent` contains `bot`, `crawl`, `spider`, `lighthouse`, `headless`, or `wget`.

3. **Rate Limiting:**
   Throttle incoming pageviews to 60 requests per IP per minute using Laravel's rate limiter:
   `Route::middleware(['throttle:60,1'])->group(...)`

4. **CORS:**
   Allow origin `https://totthobox.com` with methods `POST, GET, OPTIONS` and headers `Content-Type, Accept, User-Agent, X-Requested-With`.

5. **Retention:**
   Raw `analytics_pageviews` older than 90 days should be pruned by `php artisan model:prune` or daily cron after aggregating into `analytics_daily_aggregates`.
