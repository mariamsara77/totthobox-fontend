export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="color-scheme" content="light dark" />
<meta name="csrf-token" content="{{ csrf_token() }}"/>

      {/* অথর ও রোবটস */}
      <meta name="author" content="Totthobox Team" />
      <meta name="robots" content="index, follow" />
<link rel="canonical" href="{{ url()->current() }}"/>

      {/* গুগল ভেরিফিকেশন ও এডসেন্স */}
      <meta name="google-site-verification" content="1-VsthqfGvXga4zKLbfjBjP6L0UFc-xBQ_aOzn1g9Ps" />
      <meta name="google-adsense-account" content="ca-pub-9522604367420521" />

      {/* ফেভিকন ও অ্যাপ টাইটেল */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="apple-mobile-web-app-title" content="Totthobox" />

      {/* ওপেন গ্রাফ (Facebook App ID) */}
      <meta property="fb:app_id" content="1108131871544005" />

      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Vapid Key */}
      <meta name="vapid-public-key" content={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''} />

      {/* থিম কালার */}
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />

      {/* পারফরম্যান্স ও ফন্ট প্রিলোড */}
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

         <link rel="preconnect" href="https://translate.googleapis.com" />
        <link rel="dns-prefetch" href="https://translate.googleapis.com" />

      {/* Google AdSense Script */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9522604367420521"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}