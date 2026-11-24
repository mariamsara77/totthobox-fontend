# Laravel 12 Web Push Notifications Setup (WEB_PUSH.md)

## 1. Overview

Totthobox PWA now supports Web Push notifications for:
- Urgent national and emergency alerts (disaster warnings, 999 bulletins)
- Public holiday announcements (Eid, Puja, national holidays)
- Breaking verified news headlines

This document describes how to implement the Web Push backend using official Laravel packages.

---

## 2. Package Installation

Install `laravel-notification-channels/webpush`:
```bash
composer require laravel-notification-channels/webpush
```

Publish migration and config:
```bash
php artisan vendor:publish --provider="NotificationChannels\WebPush\WebPushServiceProvider" --tag="migrations"
php artisan vendor:publish --provider="NotificationChannels\WebPush\WebPushServiceProvider" --tag="config"
php artisan migrate
```

Generate VAPID keys:
```bash
php artisan webpush:vapid
```
Add the generated keys to your `.env` file:
```env
VAPID_PUBLIC_KEY="BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
VAPID_PRIVATE_KEY="your_private_key_here"
VAPID_SUBJECT="mailto:admin@totthobox.com"
```

---

## 3. Subscription Controller

Create `app/Http/Controllers/Api/PushSubscriptionController.php`:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use NotificationChannels\WebPush\PushSubscription;

class PushSubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'endpoint'    => 'required|url',
            'keys.auth'   => 'required',
            'keys.p256dh' => 'required',
        ]);

        $endpoint = $request->input('endpoint');
        $token = $request->input('keys.auth');
        $key = $request->input('keys.p256dh');

        // Check if anonymous or authenticated visitor
        $user = $request->user();

        PushSubscription::updateOrCreate(
            ['endpoint' => $endpoint],
            [
                'subscribable_type' => $user ? get_class($user) : 'App\Models\AnonymousVisitor',
                'subscribable_id'   => $user ? $user->id : 0,
                'public_key'        => $key,
                'auth_token'        => $token,
                'content_encoding'  => $request->input('contentEncoding', 'aesgcm'),
            ]
        );

        return response()->json(['success' => true, 'message' => 'Subscribed successfully']);
    }

    public function destroy(Request $request)
    {
        $endpoint = $request->input('endpoint');
        PushSubscription::where('endpoint', $endpoint)->delete();

        return response()->json(['success' => true, 'message' => 'Unsubscribed successfully']);
    }
}
```

Register route in `routes/api.php`:
```php
Route::post('/push/subscribe', [App\Http\Controllers\Api\PushSubscriptionController::class, 'store']);
Route::post('/push/unsubscribe', [App\Http\Controllers\Api\PushSubscriptionController::class, 'destroy']);
```

---

## 4. Dispatching a Web Push Notification

Example Notification: `app/Notifications/EmergencyAlertNotification.php`:
```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class EmergencyAlertNotification extends Notification
{
    use Queueable;

    protected $title;
    protected $body;
    protected $url;

    public function __construct(string $title, string $body, string $url = '/')
    {
        $this->title = $title;
        $this->body = $body;
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title($this->title)
            ->icon('https://totthobox.com/web-app-manifest-192x192.png')
            ->badge('https://totthobox.com/web-app-manifest-192x192.png')
            ->body($this->body)
            ->action('দেখুন', 'open_url')
            ->data(['url' => $this->url]);
    }
}
```

Triggering in an Artisan command or Controller:
```php
use NotificationChannels\WebPush\PushSubscription;
use App\Notifications\EmergencyAlertNotification;
use Illuminate\Support\Facades\Notification;

$subscriptions = PushSubscription::all();
Notification::send($subscriptions, new EmergencyAlertNotification(
    'জরুরি ঘোষণা | Totthobox',
    'ঘূর্ণিঝড়ের সতর্কতা: উপকূলীয় অঞ্চলে ১০ নম্বর মহাবিপদ সংকেত জারি।',
    'https://totthobox.com/news'
));
```
