"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const TYPES = [
  { id: "text", label: "টেক্সট" },
  { id: "url", label: "লিংক / URL" },
  { id: "wifi", label: "ওয়াইফাই" },
  { id: "email", label: "ইমেইল" },
  { id: "phone", label: "ফোন" },
  { id: "sms", label: "SMS" },
  { id: "vcard", label: "ভিকার্ড" },
];

const DOT_STYLES = [
  { value: "square", label: "স্কয়ার" },
  { value: "dots", label: "ডটস" },
  { value: "rounded", label: "রাউন্ডেড" },
  { value: "classy", label: "ক্ল্যাসি" },
  { value: "classy-rounded", label: "ক্ল্যাসি রাউন্ডেড" },
  { value: "extra-rounded", label: "এক্সট্রা রাউন্ডেড" },
];

const CORNER_SQUARE = [
  { value: "square", label: "স্কয়ার" },
  { value: "dot", label: "ডট" },
  { value: "extra-rounded", label: "এক্সট্রা রাউন্ডেড" },
];

const CORNER_DOT = [
  { value: "square", label: "স্কয়ার" },
  { value: "dot", label: "ডট" },
];

const ECC_LEVELS = [
  { value: "L", label: "কম (L) — ~7%" },
  { value: "M", label: "মাঝারি (M) — ~15%" },
  { value: "Q", label: "উচ্চ (Q) — ~25%" },
  { value: "H", label: "সর্বোচ্চ (H) — ~30%" },
];

function escapeWifi(v) {
  return String(v ?? "").replace(/([\\;,:"])/g, "\\$1");
}

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "_" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

export default function QRGenerator() {
  const [type, setType] = useState("text");
  const [content, setContent] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardUrl, setVcardUrl] = useState("");
  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(10);
  const [fgColor, setFgColor] = useState("#000000");
  const [fgColor2, setFgColor2] = useState("#000000");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecc, setEcc] = useState("M");
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerSquareStyle, setCornerSquareStyle] = useState("extra-rounded");
  const [cornerDotStyle, setCornerDotStyle] = useState("dot");
  const [logoDataUrl, setLogoDataUrl] = useState(null);

  const [libReady, setLibReady] = useState(false);
  const [libFailed, setLibFailed] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const containerRef = useRef(null);
  const qrRef = useRef(null);
  const lastKeyRef = useRef("");
  const fileInputRef = useRef(null);

  // Load qr-code-styling from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.QRCodeStyling) {
      setLibReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js";
    script.async = true;
    script.onload = () => setLibReady(true);
    script.onerror = () => setLibFailed(true);
    document.body.appendChild(script);
    return () => {
      // keep script for reuse
    };
  }, []);

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem("qr_gen_history_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed.slice(0, 8));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("qr_gen_history_v2", JSON.stringify(history));
    } catch {}
  }, [history]);

  const getFinalContent = useCallback(() => {
    switch (type) {
      case "url": {
        let raw = (content || "").trim();
        if (!raw) return "";
        if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
        return raw;
      }
      case "email": {
        const raw = (content || "").trim();
        if (!raw) return "";
        return raw.startsWith("mailto:") ? raw : "mailto:" + raw;
      }
      case "phone": {
        const raw = (content || "").trim();
        if (!raw) return "";
        return raw.startsWith("tel:") ? raw : "tel:" + raw.replace(/\s+/g, "");
      }
      case "wifi": {
        const ssid = (wifiSsid || "").trim();
        if (!ssid) return "";
        const hidden = wifiHidden ? "true" : "false";
        if (wifiEncryption === "nopass")
          return `WIFI:T:nopass;S:${escapeWifi(ssid)};H:${hidden};;`;
        return `WIFI:T:${wifiEncryption};S:${escapeWifi(ssid)};P:${escapeWifi(wifiPassword)};H:${hidden};;`;
      }
      case "sms": {
        const num = (smsNumber || "").trim();
        if (!num) return "";
        return `SMSTO:${num}:${smsMessage || ""}`;
      }
      case "vcard": {
        const name = (vcardName || "").trim();
        if (!name) return "";
        const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${name}`, `FN:${name}`];
        if (vcardOrg) lines.push(`ORG:${vcardOrg}`);
        if (vcardPhone) lines.push(`TEL;TYPE=CELL:${vcardPhone}`);
        if (vcardEmail) lines.push(`EMAIL:${vcardEmail}`);
        if (vcardUrl) lines.push(`URL:${vcardUrl}`);
        lines.push("END:VCARD");
        return lines.join("\n");
      }
      default:
        return (content || "").trim();
    }
  }, [
    type,
    content,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    smsNumber,
    smsMessage,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
    vcardUrl,
  ]);

  const finalData = useMemo(() => getFinalContent(), [getFinalContent]);

  const generate = useCallback(() => {
    if (!libReady || typeof window === "undefined" || !window.QRCodeStyling) return;
    const data = finalData;
    if (!data) {
      setHasContent(false);
      if (containerRef.current) containerRef.current.innerHTML = "";
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const dotsOptions = { type: dotStyle || "rounded" };
    if (useGradient) {
      dotsOptions.gradient = {
        type: gradientType || "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: fgColor || "#000000" },
          { offset: 1, color: fgColor2 || "#000000" },
        ],
      };
    } else {
      dotsOptions.color = fgColor || "#000000";
    }

    const options = {
      width: Number(size) || 320,
      height: Number(size) || 320,
      type: "canvas",
      data,
      margin: Number(margin) || 0,
      qrOptions: { errorCorrectionLevel: ecc || "M" },
      dotsOptions,
      backgroundOptions: { color: bgColor || "#ffffff" },
      cornersSquareOptions: {
        type: cornerSquareStyle || "extra-rounded",
        color: fgColor || "#000000",
      },
      cornersDotOptions: {
        type: cornerDotStyle || "dot",
        color: fgColor || "#000000",
      },
    };

    if (logoDataUrl) {
      options.image = logoDataUrl;
      options.imageOptions = {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.4,
        hideBackgroundDots: true,
      };
    }

    try {
      if (!qrRef.current) {
        qrRef.current = new window.QRCodeStyling(options);
        container.innerHTML = "";
        qrRef.current.append(container);
      } else {
        qrRef.current.update(options);
      }
      setHasContent(true);

      const key = type + "::" + data;
      if (key !== lastKeyRef.current && data.length > 1) {
        lastKeyRef.current = key;
        const map = {
          url: "লিংক",
          wifi: "ওয়াইফাই",
          email: "ইমেইল",
          phone: "ফোন",
          sms: "SMS",
          vcard: "ভিকার্ড",
          text: "টেক্সট",
        };
        const label = `[${map[type] || type}] ${data.replace(/\n/g, " ").slice(0, 48)}`;
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setHistory((prev) => {
          if (prev[0]?.label === label) return prev;
          return [{ label, time }, ...prev].slice(0, 8);
        });
      }
    } catch (err) {
      console.error("[QR] generation error:", err);
      setHasContent(false);
    }
  }, [
    libReady,
    finalData,
    size,
    margin,
    fgColor,
    fgColor2,
    useGradient,
    gradientType,
    bgColor,
    ecc,
    dotStyle,
    cornerSquareStyle,
    cornerDotStyle,
    logoDataUrl,
    type,
  ]);

  useEffect(() => {
    const t = setTimeout(() => generate(), 200);
    return () => clearTimeout(t);
  }, [generate]);

  const changeType = (id) => {
    setType(id);
    setContent("");
    setWifiSsid("");
    setWifiPassword("");
    setVcardName("");
    setVcardPhone("");
    setVcardEmail("");
    setVcardOrg("");
    setVcardUrl("");
    setSmsNumber("");
    setSmsMessage("");
  };

  const resetStyle = () => {
    setSize(320);
    setMargin(10);
    setFgColor("#000000");
    setFgColor2("#000000");
    setUseGradient(false);
    setGradientType("linear");
    setBgColor("#ffffff");
    setEcc("M");
    setDotStyle("rounded");
    setCornerSquareStyle("extra-rounded");
    setCornerDotStyle("dot");
    setLogoDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const download = async (ext) => {
    if (!qrRef.current || !hasContent) return;
    await qrRef.current.download({
      name: `Totthobox_qr_generator_${timestamp()}`,
      extension: ext,
    });
  };

  const copyImage = async () => {
    if (!qrRef.current || !hasContent) return;
    try {
      const blob = await qrRef.current.getRawData("png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("কপি করা যায়নি, ডাউনলোড ব্যবহার করুন");
    }
  };

  const copyText = async () => {
    if (!finalData) return;
    try {
      await navigator.clipboard.writeText(finalData);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const shareQR = async () => {
    if (!qrRef.current || !hasContent || !navigator.share) return;
    try {
      const blob = await qrRef.current.getRawData("png");
      const file = new File([blob], "qr-code.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "QR কোড" });
    } catch {}
  };

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const inputClass =
    "w-full p-2 rounded-xl bg-zinc-400/10 border-none outline-none text-sm";
  const labelClass = "text-sm  ";

  return (
    <section className="w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 text-xs  rounded-full bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300">
          বিনামূল্যে · রেজিস্ট্রেশন লাগবে না
        </span>
        <h1 className="text-2xl  font-bold tracking-tight text-zinc-50 dark:text-white">
          QR কোড জেনারেটর
        </h1>
        <p className="text-base  max-w-xl mx-auto">
          টেক্সট, লিংক, ওয়াইফাই, SMS, ভিকার্ড বা ফোন নম্বর লিখুন — সাথে সাথে প্রফেশনাল QR কোড তৈরি হবে।
        </p>
      </div>

      {libFailed && (
        <div className="rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 bg-zinc-400/25 dark:bg-zinc-400/25 px-4 py-2 flex items-center justify-between gap-4">
          <p className="text-sm opacity-50 dark:opacity-50">
            QR লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/25 text-white"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Type tabs */}
      <div className="overflow-x-auto -mx-1 px-1 pb-1">
        <div className="flex gap-1 min-w-max">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => changeType(t.id)}
              className={`px-3 py-2 text-xs sm:text-sm  rounded-xl whitespace-nowrap  ${
                type === t.id
                  ? "bg-zinc-400/25 text-white"
                  : "bg-zinc-400/10  hover:bg-zinc-400/10 hover:bg-zinc-400/25"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 p-4 space-y-4">
            {type === "text" && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>যা লিখতে চান</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="যেকোনো টেক্সট..."
                  className={inputClass + " resize-y"}
                />
              </div>
            )}

            {type === "url" && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>ওয়েবসাইট লিংক</label>
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>
            )}

            {type === "wifi" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>নেটওয়ার্ক নাম (SSID)</label>
                  <input
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHomeWiFi"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>পাসওয়ার্ড</label>
                  <input
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="password123"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>এনক্রিপশন ধরন</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className={inputClass}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">পাসওয়ার্ড নেই (Open)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 mt-6 text-sm ">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded"
                  />
                  হিডেন নেটওয়ার্ক
                </label>
              </div>
            )}

            {type === "email" && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>
            )}

            {type === "phone" && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>ফোন নম্বর</label>
                <input
                  type="tel"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className={inputClass}
                />
              </div>
            )}

            {type === "sms" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>প্রাপকের নম্বর</label>
                  <input
                    type="tel"
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>বার্তা (ঐচ্ছিক)</label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={3}
                    placeholder="আপনার বার্তা লিখুন..."
                    className={inputClass + " resize-y"}
                  />
                </div>
              </div>
            )}

            {type === "vcard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>পূর্ণ নাম</label>
                  <input
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    placeholder="রহিম উদ্দিন"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>ফোন নম্বর</label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>ইমেইল</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>প্রতিষ্ঠান (ঐচ্ছিক)</label>
                  <input
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="Totthobox"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className={labelClass}>ওয়েবসাইট (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={vcardUrl}
                    onChange={(e) => setVcardUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-400/25">
              <button
                onClick={() => changeType(type)}
                className="px-3 py-1.5 text-sm rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/10"
              >
                রিসেট
              </button>
              {type === "text" && (
                <button
                  onClick={() => setContent("আসসালামু আলাইকুম! এটি একটি টেস্ট QR কোড।")}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  বাংলা টেক্সট
                </button>
              )}
              {type === "url" && (
                <>
                  <button
                    onClick={() => setContent("https://google.com")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => setContent("https://youtube.com")}
                    className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                  >
                    YouTube
                  </button>
                </>
              )}
              {type === "wifi" && (
                <button
                  onClick={() => {
                    setWifiSsid("MyHomeWiFi");
                    setWifiPassword("password123");
                    setWifiEncryption("WPA");
                    setWifiHidden(false);
                  }}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  ওয়াইফাই উদাহরণ
                </button>
              )}
              {type === "email" && (
                <button
                  onClick={() => setContent("hello@example.com")}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  ইমেইল
                </button>
              )}
              {type === "phone" && (
                <button
                  onClick={() => setContent("+8801712345678")}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  ফোন
                </button>
              )}
              {type === "sms" && (
                <button
                  onClick={() => {
                    setSmsNumber("+8801712345678");
                    setSmsMessage("আসসালামু আলাইকুম");
                  }}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  SMS উদাহরণ
                </button>
              )}
              {type === "vcard" && (
                <button
                  onClick={() => {
                    setVcardName("রহিম উদ্দিন");
                    setVcardPhone("+8801712345678");
                    setVcardEmail("rahim@example.com");
                    setVcardOrg("Totthobox");
                    setVcardUrl("https://totthobox.com");
                  }}
                  className="px-3 py-1.5 text-xs rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  ভিকার্ড উদাহরণ
                </button>
              )}
            </div>
          </div>

          {/* Advanced customization */}
          <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-2  text-zinc-50 text-zinc-200 hover:bg-zinc-400/10 hover:bg-zinc-400/10"
            >
              <span>অ্যাডভান্সড কাস্টমাইজেশন</span>
              <svg
                className={`w-4 h-4 text-zinc-400 transition ${showAdvanced ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="px-4 pb-4 space-y-5 border-t border-zinc-400/25 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>সাইজ (পিক্সেল)</label>
                    <div className="flex items-center gap-4 mt-1.5">
                      <input
                        type="range"
                        min="128"
                        max="1024"
                        step="8"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <span className="text-sm font-mono w-12 text-right tabular-nums">{size}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[256, 512, 1024].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className="px-2 py-1 text-xs rounded bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                        >
                          {s === 256 ? "ছোট" : s === 512 ? "মাঝারি" : "বড়"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>কোয়ায়েট জোন / মার্জিন</label>
                    <div className="flex items-center gap-4 mt-1.5">
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <span className="text-sm font-mono w-12 text-right tabular-nums">{margin}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>এরর করেকশন</label>
                    <select value={ecc} onChange={(e) => setEcc(e.target.value)} className={inputClass}>
                      {ECC_LEVELS.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-zinc-400">লোগো যোগ করলে &quot;সর্বোচ্চ (H)&quot; বেছে নিন।</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>QR রঙ</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="h-10 w-14 rounded-xl border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className={inputClass + " font-mono"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>ব্যাকগ্রাউন্ড</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10 w-14 rounded-xl border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className={inputClass + " font-mono"}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm ">
                    <input
                      type="checkbox"
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                      className="rounded"
                    />
                    গ্রেডিয়েন্ট রঙ ব্যবহার করুন
                  </label>
                  {useGradient && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className={labelClass}>দ্বিতীয় রঙ</label>
                        <div className="flex items-center gap-2 mt-1.5">
                          <input
                            type="color"
                            value={fgColor2}
                            onChange={(e) => setFgColor2(e.target.value)}
                            className="h-10 w-14 rounded-xl border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={fgColor2}
                            onChange={(e) => setFgColor2(e.target.value)}
                            className={inputClass + " font-mono"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className={labelClass}>গ্রেডিয়েন্ট ধরন</label>
                        <select
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value)}
                          className={inputClass}
                        >
                          <option value="linear">লিনিয়ার</option>
                          <option value="radial">রেডিয়াল</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>ডট স্টাইল</label>
                    <select value={dotStyle} onChange={(e) => setDotStyle(e.target.value)} className={inputClass}>
                      {DOT_STYLES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>কর্নার স্টাইল</label>
                    <select
                      value={cornerSquareStyle}
                      onChange={(e) => setCornerSquareStyle(e.target.value)}
                      className={inputClass}
                    >
                      {CORNER_SQUARE.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>কর্নার ডট স্টাইল</label>
                    <select
                      value={cornerDotStyle}
                      onChange={(e) => setCornerDotStyle(e.target.value)}
                      className={inputClass}
                    >
                      {CORNER_DOT.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>লোগো (ঐচ্ছিক)</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onLogoChange}
                      className="text-sm text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-zinc-400/10 dark:file:bg-zinc-400/10 file:text-sm file: hover:file:bg-zinc-400/10 dark:hover:file:bg-zinc-400/25 cursor-pointer"
                    />
                    {logoDataUrl && (
                      <button
                        onClick={removeLogo}
                        className="px-2 py-1 text-xs rounded bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                      >
                        লোগো সরান
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    লোগো QR এর মাঝখানে বসবে। স্ক্যান করতে সমস্যা হলে এরর করেকশন &quot;সর্বোচ্চ (H)&quot; করুন।
                  </p>
                </div>

                <button
                  onClick={resetStyle}
                  className="px-3 py-1.5 text-sm rounded-xl text-zinc-400 hover:bg-zinc-400/10 hover:bg-zinc-400/10"
                >
                  স্টাইল রিসেট করুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 p-4 space-y-4">
            <div className="text-center">
              <span className="inline-block px-2.5 py-0.5 text-xs  rounded-full bg-zinc-400/10  mb-4">
                লাইভ প্রিভিউ
              </span>
              <div className="flex justify-center items-center p-4 bg-zinc-400/10/50 rounded-xl border border-dashed border-zinc-400/25 dark:border-zinc-400/25 min-h-[220px]">
                {!hasContent && (
                  <div className="text-center text-zinc-400">
                    <svg className="mx-auto w-12 h-12 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-sm">কন্টেন্ট লিখুন</p>
                  </div>
                )}
                <div
                  ref={containerRef}
                  className={`[&>canvas]:rounded-xl [&>canvas]: [&>canvas]:max-w-full ${hasContent ? "" : "hidden"}`}
                />
              </div>
            </div>

            {hasContent && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => download("png")}
                    className="py-2 text-sm  rounded-xl bg-zinc-400/25 text-white bg-zinc-400/25"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => download("jpeg")}
                    className="py-2 text-sm  rounded-xl bg-zinc-400/25 text-white bg-zinc-400/25"
                  >
                    JPEG
                  </button>
                  <button
                    onClick={() => download("svg")}
                    className="py-2 text-sm  rounded-xl bg-zinc-400/25 text-white bg-zinc-400/25"
                  >
                    SVG
                  </button>
                </div>
                <button
                  onClick={copyImage}
                  className="w-full py-2 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  {copied ? "কপি হয়েছে!" : "ছবি কপি করুন"}
                </button>
                <button
                  onClick={copyText}
                  className="w-full py-2 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                >
                  ডেটা টেক্সট কপি করুন
                </button>
                {canShare && (
                  <button
                    onClick={shareQR}
                    className="w-full py-2 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25"
                  >
                    শেয়ার করুন
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm  ">সাম্প্রতিক QR</h3>
            <button
              onClick={() => {
                setHistory([]);
                try {
                  localStorage.removeItem("qr_gen_history_v2");
                } catch {}
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300"
            >
              সব মুছে ফেলুন
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-full bg-zinc-400/10 "
              >
                {h.label}
                <span className="opacity-50">{h.time}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How to + FAQ */}
      <div className="mt-12 pt-8 border-t border-zinc-400/25 space-y-8 text-sm ">
        <div>
          <h2 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-2">কীভাবে ব্যবহার করবেন?</h2>
          <p className="leading-relaxed">
            ট্যাব থেকে ধরন বেছে নিন → তথ্য লিখুন → QR কোড সাথে সাথে দেখাবে → PNG/JPEG/SVG ফরম্যাটে ডাউনলোড করুন। রঙ,
            গ্রেডিয়েন্ট, ডট স্টাইল, কর্নার স্টাইল, লোগো, সাইজ ও এরর করেকশন ইচ্ছেমতো বদলাতে পারবেন।
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
          <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
            ফ্রি অ্যাডভান্সড অনলাইন QR কোড জেনারেটর
          </h2>
          <p className="leading-relaxed">
            এই টুল দিয়ে <strong>টেক্সট, URL, WiFi, ইমেইল, ফোন নম্বর, SMS ও ভিকার্ড (vCard)</strong> থেকে তাৎক্ষণিক
            প্রফেশনাল QR কোড তৈরি করুন। সম্পূর্ণ ফ্রি, রেজিস্ট্রেশন লাগে না, আর সবকিছু আপনার ব্রাউজারেই হয় — কোনো ডেটা
            সার্ভারে যায় না।
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
          <div className="space-y-2">
            {[
              {
                q: "এই QR জেনারেটর কি ফ্রি?",
                a: "হ্যাঁ। সম্পূর্ণ ফ্রি, কোনো রেজিস্ট্রেশন বা ওয়াটারমার্ক নেই।",
              },
              {
                q: "কোন কোন ধরনের QR বানানো যায়?",
                a: "টেক্সট, ওয়েব লিংক (URL), WiFi, ইমেইল, ফোন নম্বর, SMS এবং ভিকার্ড (vCard) — এই সাত ধরন সাপোর্টেড।",
              },
              {
                q: "লোগো সহ QR স্ক্যান হবে তো?",
                a: 'হ্যাঁ, তবে এরর করেকশন লেভেল "সর্বোচ্চ (H)" রাখুন এবং লোগো খুব বড় না করাই ভালো।',
              },
              {
                q: "ডাটা কি সার্ভারে যায়?",
                a: "না। QR কোড সম্পূর্ণ আপনার ব্রাউজারে তৈরি হয়। কোনো কন্টেন্ট বা লোগো সার্ভারে আপলোড হয় না।",
              },
              {
                q: "কীভাবে ডাউনলোড করব?",
                a: "QR দেখা গেলে PNG, JPEG বা SVG বাটনে ক্লিক করুন। ফাইল নাম হবে Totthobox_qr_generator_তারিখ-সময়.[extension]।",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 py-2  text-zinc-50 text-zinc-200 hover:bg-zinc-400/10 hover:bg-zinc-400/10">
                  {item.q}
                  <svg
                    className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm  leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
