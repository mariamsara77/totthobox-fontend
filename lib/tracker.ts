// lib/tracker.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.totthobox.com';

type TrackPayload = Record<string, any>;

class VisitorTracker {
  private visitorId: string;
  private sessionId: string;
  private systemPayload: Record<string, any> = {};
  private initialized = false;
  private lastPageView = '';
  private lastPageViewTime = 0;
  private navigationStart = 0;
  private isNavigating = false;

  constructor() {
    this.visitorId = this.getId('visitor_id', 'vis_', false);
    this.sessionId = this.getId('session_id', 'ses_', true);

    // সিস্টেম ইনফো একবারই তৈরি
    this.systemPayload = {
      ram: (navigator as any).deviceMemory ?? null,
      cpu_cores: navigator.hardwareConcurrency ?? null,
      screen_res: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_pwa: this.detectPwa(),
    };
  }

  private detectPwa(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  private storage(key: string, val?: string, session = false): string | null {
    try {
      const store = session ? sessionStorage : localStorage;
      if (val !== undefined) {
        store.setItem(key, val);
        return val;
      }
      return store.getItem(key);
    } catch {
      return null;
    }
  }

  private makeId(prefix: string): string {
    return (
      prefix +
      Math.random().toString(36).slice(2, 10) +
      Date.now().toString(36)
    );
  }

  private getId(key: string, prefix: string, session: boolean): string {
    let id = this.storage(key, undefined, session);
    if (!id) {
      id = this.makeId(prefix);
      this.storage(key, id, session);
    }
    return id!;
  }

  private queueOffline(url: string, data: any) {
    try {
      const existing = JSON.parse(this.storage('tracking_queue') || '[]');
      existing.push({ url, data, ts: Date.now() });
      // শুধু শেষ ২৫টা রাখি (স্টোরেজ চাপ কম রাখতে)
      this.storage('tracking_queue', JSON.stringify(existing.slice(-25)));
    } catch {}
  }

  /** সবচেয়ে হালকা পাঠানোর উপায় */
  private send(url: string, data: any) {
    if (typeof navigator === 'undefined') return;

    if (!navigator.onLine) {
      this.queueOffline(url, data);
      return;
    }

    const json = JSON.stringify(data);

    // ১. sendBeacon (সবচেয়ে ভালো – UI ব্লক করে না)
    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return;
    }

    // ২. fallback fetch (keepalive + low priority)
    fetch(url, {
      method: 'POST',
      keepalive: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: json,
      // @ts-ignore
      priority: 'low',
    }).catch(() => this.queueOffline(url, data));
  }

  /** Idle সময়ে পাঠায় – মেইন থ্রেড ব্লক করে না */
  private scheduleSend(fn: () => void) {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 100);
    }
  }

  public startNavigation() {
    this.navigationStart = performance.now();
    this.isNavigating = true;
  }

  public trackEvent(category: string, action: string, payload: TrackPayload = {}) {
    this.scheduleSend(() => {
      this.send(`${API_BASE}/api/tracking/event`, {
        category,
        action,
        js_visitor_id: this.visitorId,
        session_id: this.sessionId,
        payload: { ...payload, ...this.systemPayload },
      });
    });
  }

  public trackPageView(path?: string, routeName?: string) {
    if (typeof window === 'undefined') return;

    const currentPath = path || window.location.pathname;
    const now = Date.now();

    // একই পেজ ৮ সেকেন্ডের মধ্যে আবার ট্র্যাক করব না
    if (currentPath === this.lastPageView && now - this.lastPageViewTime < 8000) {
      return;
    }

    this.lastPageView = currentPath;
    this.lastPageViewTime = now;

    let loadTimeMs = 0;

    if (this.isNavigating && this.navigationStart > 0) {
      loadTimeMs = Math.round(performance.now() - this.navigationStart);
    } else {
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav && nav.loadEventEnd > 0) {
        loadTimeMs = Math.round(nav.loadEventEnd - nav.startTime);
      }
    }

    // রিসেট
    this.isNavigating = false;
    this.navigationStart = 0;

    // অতিরিক্ত বড় ভ্যালু ফিল্টার
    if (loadTimeMs > 30000) loadTimeMs = 0;

    this.scheduleSend(() => {
      const params = new URLSearchParams(window.location.search);

      this.send(`${API_BASE}/api/tracking/event`, {
        category: 'page',
        action: 'view',
        js_visitor_id: this.visitorId,
        session_id: this.sessionId,
        payload: {
          path: currentPath,
          url: window.location.href,
          referrer: document.referrer || null,
          title: document.title || null,
          route_name: routeName || null,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
          is_pwa: this.detectPwa(),
          load_time_ms: loadTimeMs,
          ...this.systemPayload,
        },
      });
    });
  }

  public syncPwaStatus(isPwa: boolean) {
    this.scheduleSend(() => {
      this.send(`${API_BASE}/api/tracking/sync-pwa`, { is_pwa: isPwa });
    });
  }

  public flushOfflineQueue() {
    try {
      const raw = this.storage('tracking_queue');
      if (!raw) return;
      const queue = JSON.parse(raw);
      if (!queue.length) return;

      const activities = queue.map((item: any) => ({
        type: item.data?.category || 'interaction',
        key: item.data?.action || 'unknown',
        value: item.data?.payload || null,
        timestamp: item.ts,
        id: item.data?.js_visitor_id || null,
      }));

      this.send(`${API_BASE}/api/tracking/sync`, { activities });
      localStorage.removeItem('tracking_queue');
    } catch {}
  }

  public init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    // Hardware info – অনেক পরে পাঠাই
    if (!this.storage('hw_tracked', undefined, true)) {
      this.scheduleSend(() => {
        this.trackEvent('system', 'hardware_info');
        this.storage('hw_tracked', '1', true);
      });
    }

    // PWA
    if (this.detectPwa() && !this.storage('pwa_synced', undefined, true)) {
      this.syncPwaStatus(true);
      this.storage('pwa_synced', '1', true);
    }

    // Click tracking (passive – স্পিড নষ্ট করে না)
    document.addEventListener(
      'click',
      (e) => {
        const el = (e.target as HTMLElement).closest('[data-track]') as HTMLElement | null;
        if (!el) return;

        this.trackEvent('interaction', 'click', {
          label: el.dataset.track,
          element: el.tagName.toLowerCase(),
          href: (el as HTMLAnchorElement).href || null,
        });
      },
      { passive: true }
    );

    window.addEventListener('online', () => this.flushOfflineQueue());
  }
}

// ---------------- Singleton + SSR Safe ----------------
let trackerInstance: VisitorTracker | null = null;

export function getTracker(): VisitorTracker {
  if (typeof window === 'undefined') {
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      startNavigation: () => {},
      syncPwaStatus: () => {},
      flushOfflineQueue: () => {},
      init: () => {},
    } as any;
  }

  if (!trackerInstance) {
    trackerInstance = new VisitorTracker();
  }
  return trackerInstance;
}

export function track(category: string, action: string, payload?: TrackPayload) {
  getTracker().trackEvent(category, action, payload);
}

export function trackPageView(path?: string, routeName?: string) {
  getTracker().trackPageView(path, routeName);
}

export function startNavigation() {
  getTracker().startNavigation();
}