# Backend Required Changes (Laravel API)

**Target Backend:** Laravel App at `https://admin.totthobox.com/api`  
**Frontend Caller:** Next.js 16 App Router at `https://totthobox.com`  
**Document Purpose:** Complete, ready-to-paste code snippets, database migrations, controller methods, and configuration updates to implement real visitor analytics, fix inflated statistics, configure trusted proxies, CORS, and privacy protections.

---

## Priority Order of Implementation

1. **Fix Inflated Numbers in AnalyticsController** (Immediate)
2. **Implement Dedicated Analytics Endpoints** (`POST /api/analytics/pageview`, `POST /api/analytics/heartbeat`, `GET /api/analytics/stats`)
3. **Configure Trusted Proxies & Throttling by Forwarded IP / Visitor ID**
4. **CORS Configuration for Totthobox Domains**
5. **Privacy: IP Hashing (HMAC with APP_KEY)**
6. **Optional: `/api/sitemap-data` for Instant Static Build & Sitemap Generation**
7. **Verification Tinker / SQL Checklist & Cleaning Test Rows**
8. **Frontend Steps to Remove Fallback File (When Backend is Ready)**

---

## 1. Audit & Fix Inflated Numbers in `AnalyticsController`

### Why:
Live probing of `GET /api/analytics/user-count` returned:
```json
{
  "status": "success",
  "data": {
    "total": "117.45k",
    "today": "10k",
    "online": "10k",
    "pwa": "10.11k"
  }
}
```
Notice:
- `online: "10k"` and `today: "10k"` are impossible in real traffic (active online users in the last 5 minutes cannot equal or exceed total daily visitors at 10,000 exactly).
- The values are rounded to exactly 10,000 / 10k, indicating hardcoded offsets or mathematical floors.

### What to Look For in Your Code:
Open `app/Http/Controllers/AnalyticsController.php` (or wherever `user-count` is defined):
1. **Hardcoded Floors / Seeds:** Look for lines like:
   ```php
   $todayCount = max(10000, ...);
   $onlineCount = max(10000, ...);
   // OR
   $total = $dbCount + 100000;
   ```
2. **Counting Events instead of Unique Visitors:**
   - Counting `TrackingEvent::count()` counts every page reload, heartbeat ping, and click. A single user browsing 20 pages creates 20 events.
   - Distinct visitor counting is required: `count(DISTINCT js_visitor_id)` or `count(DISTINCT visitor_id)`.
3. **Online User Calculation:**
   - "Online" must count distinct visitors who sent a pageview or heartbeat in the last **5 minutes**:
     `now()->subMinutes(5)`.
4. **Timezone Day Boundary:**
   - In Bangladesh, days start at midnight **Asia/Dhaka** (`UTC+6`). If the server runs on UTC, "today" counts reset at 6:00 AM BD time instead of midnight. Use `Carbon::now('Asia/Dhaka')->startOfDay()`.

---

## 2. Implement Dedicated Analytics Endpoints

The frontend proxy currently falls back to `/api/tracking/event` and `/api/analytics/user-count`. Once you implement these 3 endpoints, the frontend proxy will automatically detect them (within 10 minutes) and send data directly without translation.

### 2.1 Database Migration (Additive Only)

Create migration: `php artisan make:migration create_visitor_analytics_tables`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Table for unique visitor pageviews
        if (!Schema::hasTable('visitor_pageviews')) {
            Schema::create('visitor_pageviews', function (Blueprint $table) {
                $table->id();
                $table->string('visitor_id', 64)->index();
                $table->string('session_id', 64)->index();
                $table->boolean('is_first_visit')->default(false);
                $table->boolean('is_pwa')->default(false);
                $table->boolean('has_installed')->default(false);
                $table->string('path', 500);
                $table->text('url');
                $table->string('title', 300)->nullable();
                $table->text('referrer')->nullable();
                $table->string('utm_source', 100)->nullable();
                $table->string('utm_medium', 100)->nullable();
                $table->string('utm_campaign', 100)->nullable();
                $table->unsignedInteger('load_time_ms')->default(0);
                $table->string('screen_res', 30)->nullable();
                $table->string('timezone', 50)->nullable();
                $table->string('device_type', 20)->default('desktop');
                $table->string('language', 20)->default('bn');
                $table->string('ip_hash', 64)->nullable()->index();
                $table->text('user_agent')->nullable();
                $table->timestamp('created_at')->useCurrent()->index();

                // Composite index for fast today / unique metrics
                $table->index(['created_at', 'visitor_id']);
            });
        }

        // 2. Table for visitor heartbeats (active online presence)
        if (!Schema::hasTable('visitor_heartbeats')) {
            Schema::create('visitor_heartbeats', function (Blueprint $table) {
                $table->id();
                $table->string('visitor_id', 64)->index();
                $table->string('session_id', 64)->index();
                $table->string('path', 500)->nullable();
                $table->text('url')->nullable();
                $table->boolean('is_pwa')->default(false);
                $table->boolean('has_installed')->default(false);
                $table->string('ip_hash', 64)->nullable();
                $table->timestamp('last_seen_at')->useCurrent()->index();

                // Unique per visitor so heartbeat updates in-place
                $table->unique('visitor_id', 'uniq_heartbeat_visitor');
            });
        }
    }

    public function down(): void
    {
        // Additive migration: down() left empty for data safety
    }
};
```

---

### 2.2 Routes Definition (`routes/api.php`)

Add the following routes to `routes/api.php`:

```php
use App\Http\Controllers\Api\AnalyticsController;

// Group with IP/Visitor-based throttling
Route::prefix('analytics')->group(function () {
    Route::post('/pageview', [AnalyticsController::class, 'pageview'])->middleware('throttle:120,1');
    Route::post('/heartbeat', [AnalyticsController::class, 'heartbeat'])->middleware('throttle:120,1');
    Route::get('/stats', [AnalyticsController::class, 'stats']);
    // Keep user-count as an alias for backwards compatibility
    Route::get('/user-count', [AnalyticsController::class, 'stats']);
});
```

---

### 2.3 Controller Implementation (`app/Http/Controllers/Api/AnalyticsController.php`)

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Privacy helper: Hash visitor IP with APP_KEY (HMAC-SHA256)
     */
    private function hashIp(?string $ip): ?string
    {
        if (!$ip) return null;
        $appKey = config('app.key') ?? 'totthobox-salt';
        return hash_hmac('sha256', $ip, $appKey);
    }

    /**
     * POST /api/analytics/pageview
     *
     * Expected JSON Payload:
     * {
     *   "visitor_id": "vis_xxxx",
     *   "session_id": "ses_xxxx",
     *   "is_first_visit": false,
     *   "is_pwa": false,
     *   "has_installed": false,
     *   "referrer": "https://google.com",
     *   "path": "/bangla/calendar",
     *   "url": "https://totthobox.com/bangla/calendar",
     *   "title": "বাংলা ক্যালেন্ডার",
     *   "utm_source": null,
     *   "utm_medium": null,
     *   "utm_campaign": null,
     *   "load_time_ms": 320,
     *   "screen_res": "1920x1080",
     *   "timezone": "Asia/Dhaka",
     *   "device_type": "desktop",
     *   "language": "bn",
     *   "timestamp": 1700000000000
     * }
     */
    public function pageview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'visitor_id'     => 'required|string|max:64',
            'session_id'     => 'required|string|max:64',
            'is_first_visit' => 'boolean',
            'is_pwa'         => 'boolean',
            'has_installed'  => 'boolean',
            'path'           => 'required|string|max:500',
            'url'            => 'required|string',
            'title'          => 'nullable|string|max:300',
            'referrer'       => 'nullable|string',
            'utm_source'     => 'nullable|string|max:100',
            'utm_medium'     => 'nullable|string|max:100',
            'utm_campaign'   => 'nullable|string|max:100',
            'load_time_ms'   => 'nullable|integer',
            'screen_res'     => 'nullable|string|max:30',
            'timezone'       => 'nullable|string|max:50',
            'device_type'    => 'nullable|string|max:20',
            'language'       => 'nullable|string|max:20',
        ]);

        $ip = $request->ip();
        $ipHash = $this->hashIp($ip);
        $userAgent = $request->userAgent();

        // Insert into visitor_pageviews
        DB::table('visitor_pageviews')->insert([
            'visitor_id'     => $validated['visitor_id'],
            'session_id'     => $validated['session_id'],
            'is_first_visit' => $validated['is_first_visit'] ?? false,
            'is_pwa'         => $validated['is_pwa'] ?? false,
            'has_installed'  => $validated['has_installed'] ?? false,
            'path'           => $validated['path'],
            'url'            => $validated['url'],
            'title'          => $validated['title'] ?? null,
            'referrer'       => $validated['referrer'] ?? null,
            'utm_source'     => $validated['utm_source'] ?? null,
            'utm_medium'     => $validated['utm_medium'] ?? null,
            'utm_campaign'   => $validated['utm_campaign'] ?? null,
            'load_time_ms'   => $validated['load_time_ms'] ?? 0,
            'screen_res'     => $validated['screen_res'] ?? null,
            'timezone'       => $validated['timezone'] ?? null,
            'device_type'    => $validated['device_type'] ?? 'desktop',
            'language'       => $validated['language'] ?? 'bn',
            'ip_hash'        => $ipHash,
            'user_agent'     => $userAgent,
            'created_at'     => Carbon::now('Asia/Dhaka'),
        ]);

        // Also record/update heartbeat so pageview registers user as online
        DB::table('visitor_heartbeats')->upsert([
            'visitor_id'     => $validated['visitor_id'],
            'session_id'     => $validated['session_id'],
            'path'           => $validated['path'],
            'url'            => $validated['url'],
            'is_pwa'         => $validated['is_pwa'] ?? false,
            'has_installed'  => $validated['has_installed'] ?? false,
            'ip_hash'        => $ipHash,
            'last_seen_at'   => Carbon::now('Asia/Dhaka'),
        ], ['visitor_id'], ['session_id', 'path', 'url', 'is_pwa', 'has_installed', 'last_seen_at']);

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * POST /api/analytics/heartbeat
     *
     * Expected JSON Payload:
     * {
     *   "visitor_id": "vis_xxxx",
     *   "session_id": "ses_xxxx",
     *   "path": "/bangla/calendar",
     *   "url": "https://totthobox.com/bangla/calendar",
     *   "is_pwa": false,
     *   "has_installed": false,
     *   "timestamp": 1700000000000
     * }
     */
    public function heartbeat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'visitor_id'    => 'required|string|max:64',
            'session_id'    => 'required|string|max:64',
            'path'          => 'nullable|string|max:500',
            'url'           => 'nullable|string',
            'is_pwa'        => 'boolean',
            'has_installed' => 'boolean',
        ]);

        $ipHash = $this->hashIp($request->ip());

        DB::table('visitor_heartbeats')->upsert([
            'visitor_id'     => $validated['visitor_id'],
            'session_id'     => $validated['session_id'],
            'path'           => $validated['path'] ?? null,
            'url'            => $validated['url'] ?? null,
            'is_pwa'         => $validated['is_pwa'] ?? false,
            'has_installed'  => $validated['has_installed'] ?? false,
            'ip_hash'        => $ipHash,
            'last_seen_at'   => Carbon::now('Asia/Dhaka'),
        ], ['visitor_id'], ['session_id', 'path', 'url', 'is_pwa', 'has_installed', 'last_seen_at']);

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * GET /api/analytics/stats
     *
     * Exact response shape expected by frontend:
     * {
     *   "status": "success",
     *   "data": {
     *     "total": "117.4k" | 117400,
     *     "today": "1.2k" | 1200,
     *     "online": 42,
     *     "pwa": 150
     *   }
     * }
     */
    public function stats(): JsonResponse
    {
        // Cache stats for 60 seconds to protect database from excessive queries
        $stats = Cache::remember('totthobox_analytics_stats', 60, function () {
            $dhakaNow = Carbon::now('Asia/Dhaka');
            $startOfDhakaDay = $dhakaNow->copy()->startOfDay();
            $fiveMinutesAgo = $dhakaNow->copy()->subMinutes(5);

            // 1. Total distinct visitors all-time
            $total = DB::table('visitor_pageviews')
                ->distinct('visitor_id')
                ->count('visitor_id');

            // 2. Today distinct visitors (midnight-to-midnight Asia/Dhaka)
            $today = DB::table('visitor_pageviews')
                ->where('created_at', '>=', $startOfDhakaDay)
                ->distinct('visitor_id')
                ->count('visitor_id');

            // 3. Online visitors (heartbeat or pageview within last 5 minutes)
            $online = DB::table('visitor_heartbeats')
                ->where('last_seen_at', '>=', $fiveMinutesAgo)
                ->count();

            // 4. Distinct PWA users (either active in PWA mode or installed)
            $pwa = DB::table('visitor_pageviews')
                ->where('is_pwa', true)
                ->orWhere('has_installed', true)
                ->distinct('visitor_id')
                ->count('visitor_id');

            return [
                'total'  => $this->formatCount($total),
                'today'  => $this->formatCount($today),
                'online' => $online,
                'pwa'    => $this->formatCount($pwa),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $stats,
        ], 200);
    }

    /**
     * Format number as 1.2k or raw integer
     */
    private function formatCount(int $count): string
    {
        if ($count >= 1000) {
            return round($count / 1000, 2) . 'k';
        }
        return (string) $count;
    }
}
```

---

## 3. Trusted Proxies & Throttling Configuration

### 3.1 Configure Trusted Proxies (`app/Http/Middleware/TrustProxies.php` or `bootstrap/app.php`)

Without configuring trusted proxies, Laravel reads the IP address of the Next.js server (e.g. `127.0.0.1` or the Vercel/proxy server IP) for every visitor. This causes:
- Every visitor sharing the same IP in Laravel.
- Throttling (`throttle:120,1`) blocking ALL visitors at once with HTTP 429.
- Distinct IP counting breaking.

**Laravel 11 (`bootstrap/app.php`):**
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: [
        // Trust your Next.js server, Vercel proxy IPs, or trust all proxies if behind Cloudflare/Vercel:
        '*',
    ]);
    $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

**Laravel 9/10 (`app/Http/Middleware/TrustProxies.php`):**
```php
protected $proxies = '*';
protected $headers = Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO;
```

### 3.2 Rate Limiting (`app/Providers/RouteServiceProvider.php` or `bootstrap/app.php`)

Ensure `RateLimiter::for('api', ...)` is keyed by the real forwarded IP or visitor ID:
```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

RateLimiter::for('api', function (Request $request) {
    $visitorKey = $request->header('X-Forwarded-For') ?? $request->ip();
    return Limit::perMinute(120)->by($visitorKey);
});

// Exempt or increase rate limits for news endpoints used during next build / cache warming:
RateLimiter::for('news_feed', function (Request $request) {
    if ($request->header('X-Build-Token') === env('BUILD_WARM_SECRET')) {
        return Limit::none();
    }
    return Limit::perMinute(300)->by($request->ip());
});
```

---

## 4. CORS Configuration (`config/cors.php`)

Ensure CORS headers allow credentials and your exact production and development origins:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://totthobox.com',
        'https://www.totthobox.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['x-tracking-upstream'],
    'max_age' => 86400,
    'supports_credentials' => true,
];
```

---

## 5. Privacy: IP Protection (No PII Stored)

As implemented in `AnalyticsController.php`:
- Never store raw IPv4 or IPv6 in the database.
- Hash the IP with HMAC-SHA256 keyed with your Laravel `APP_KEY`:
  ```php
  $ipHash = hash_hmac('sha256', $request->ip(), config('app.key'));
  ```
- Store only `$ipHash` (64 characters).
- This satisfies GDPR, AdSense vendor privacy requirements, and allows counting unique IPs without storing personally identifiable information.

---

## 6. Optional: Fast Static Sitemap Data (`GET /api/sitemap-data`)

To avoid heavy pagination during Next.js static builds and sitemap regeneration, add this lightweight endpoint:

`routes/api.php`:
```php
Route::get('/sitemap-data', function () {
    return Cache::remember('totthobox_sitemap_data', 3600, function () {
        return response()->json([
            'status' => 'success',
            'data' => [
                'countries'    => DB::table('countries')->select('slug', 'updated_at')->get(),
                'districts'    => DB::table('districts')->select('slug', 'updated_at')->get(),
                'divisions'    => DB::table('divisions')->select('slug', 'updated_at')->get(),
                'apps'         => DB::table('apps')->select('slug', 'updated_at')->get(),
                'signs'        => DB::table('signs')->select('slug', 'updated_at')->get(),
                'police'       => DB::table('police_stations')->select('slug', 'updated_at')->get(),
            ],
        ]);
    });
});
```

---

## 7. Verification Tinker / SQL Checklist & Deleting Test Rows

### 7.1 Verify Rows in Tinker
Run in terminal on your server:
```bash
php artisan tinker
```
```php
// Check pageviews
DB::table('visitor_pageviews')->orderBy('id', 'desc')->take(5)->get();

// Check heartbeats
DB::table('visitor_heartbeats')->orderBy('last_seen_at', 'desc')->take(5)->get();

// Check stats calculation
app(\App\Http\Controllers\Api\AnalyticsController::class)->stats();
```

### 7.2 Deleting Test Rows
To delete all test probe rows created by audit scripts (visitor IDs prefixed with `test-`):
```sql
DELETE FROM visitor_pageviews WHERE visitor_id LIKE 'test-%';
DELETE FROM visitor_heartbeats WHERE visitor_id LIKE 'test-%';
```
Or in Tinker:
```php
DB::table('visitor_pageviews')->where('visitor_id', 'like', 'test-%')->delete();
DB::table('visitor_heartbeats')->where('visitor_id', 'like', 'test-%')->delete();
```

---

## 8. Frontend Steps to Remove Fallback File (When Backend Is Ready)

Once you have deployed the backend endpoints above:

1. Open `lib/server/analytics-proxy.ts` in the frontend.
2. Change line 38:
   ```ts
   const FORCE_MODERN_ONLY = true;
   ```
3. Test that telemetry flows directly to `/api/analytics/pageview`, `/api/analytics/heartbeat`, and `/api/analytics/stats`.
4. The fallback methods (`/tracking/event` and `/tracking/sync-pwa`) in `lib/server/analytics-proxy.ts` can then be deleted at your convenience.
