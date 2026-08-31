import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Totthobox - Digital Information Hub",
    short_name: "Totthobox",
    description: "ইতিহাস, ইসলামি জ্ঞান, স্বাস্থ্য টিপস এবং শিক্ষামূলক টুলস এখন আপনার হাতের মুঠোয়।",
    start_url: "/?utm_source=pwa&utm_medium=pwa_app&install=true",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay"],
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["education", "books", "utilities", "lifestyle", "productivity"],
    lang: "bn-BD",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    // @ts-ignore
    id: "com.totthobox.ai.app",
    screenshots: [
  {
    src: "/Screenshot_light.png",
    sizes: "1080x1920",
    type: "image/png",
    form_factor: "narrow",
    label: "Totthobox Home (Light)"
  },
  {
    src: "/Screenshot_dark.png",
    sizes: "1080x1920",
    type: "image/png",
    form_factor: "narrow",
    label: "Totthobox Home (Dark)"
  },
  {
    src: "/Screenshot_light_desktop.png",
    sizes: "1917x958",
    type: "image/png",
    form_factor: "wide",
    label: "Desktop View (Light)"
  },
  {
    src: "/Screenshot_dark_desktop.png",
    sizes: "1918x959",
    type: "image/png",
    form_factor: "wide",
    label: "Desktop View (Dark)"
  }
],
    shortcuts: [
      {
        name: "Bangla Calendar",
        short_name: "Bangla Calendar",
        url: "/bangla/calendar",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Basic Islamic",
        short_name: "Basic Islamic",
        url: "/islam/basic",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Bangladesh Information",
        short_name: "Bangladesh Information",
        url: "/bangladesh/introduction",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Converter",
        short_name: "Converter",
        url: "/converter/number-to-word",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }]
      }
    ],
    share_target: {
      action: "/share",
      method: "POST",
      enctype: "application/x-www-form-urlencoded",
      params: {
        title: "title",
        text: "text",
        url: "url"
      }
    }
  } as MetadataRoute.Manifest;
}