self.addEventListener('push', event => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'Totthobox', body: event.data.text() }; }
  const title = data.title || 'Totthobox';
  const options = {
    body: data.body || 'নতুন তথ্য ও আপডেট এসেছে।',
    icon: data.icon || '/icons/icon-192.svg',
    badge: data.badge || '/icons/icon-192.svg',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    tag: data.tag || 'totthobox-notification',
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const existing = list.find(client => client.url.startsWith(self.location.origin));
    if (existing) return existing.navigate(target).then(c => c?.focus());
    return clients.openWindow(target);
  }));
});
