# SOFTWARE_AUDIT.md — Search Console Optimization Pass

**Date:** 2026-11-15
**Auditor:** Automated SEO Pass (Antigravity Agent)
**Scope:** All software records reachable via `/api/apps/all` and individual `/api/apps/{slug}` endpoints

> ⚠️ **This file contains findings only. No records were deleted or edited.**
> Human review is required before any download links are changed/removed in the admin panel.

---

## Critical Finding

**ALL 15 download links point to a single unofficial GitHub repository:**
`github.com/mariamsara77/recuva/releases/download/...`

This is NOT an official vendor domain for any of the listed software.
A single non-official repo hosting all software — including commercial titles — is a high-risk signal.

---

## Risk Summary

| Risk Level | Count |
|-----------|-------|
| 🔴 HIGH — Commercial copyrighted software from unofficial repo | 3 |
| 🟡 MEDIUM — Open-source but hosted on unofficial repo | 6 |
| 🟢 LOW — Free/open-source, unofficial repo, license stated or checkable | 4 |
| ⚪ NEEDS REVIEW — License not stated in API data | 2 |

---

## Detailed Findings

| ID | Slug | Name | Link Domain | Risk | Recommended Action |
|----|------|------|-------------|------|--------------------|
| 1 | bijoy-bayanno | Bijoy Bayanno 2016 | github.com/mariamsara77/recuva | 🔴 HIGH — Commercial copyrighted software (Ananda Computers). Distributing from unofficial repo is likely a copyright violation. | **REMOVE download link immediately.** Link to official `bijoyekushe.com` only. |
| 15 | microsoft-office-2007 | Microsoft Office 2007 | github.com/mariamsara77/recuva | 🔴 HIGH — Commercial Microsoft software, redistributing from unofficial repo is a copyright violation. | **REMOVE download link immediately.** Link to `microsoft.com` only. |
| 16 | microsoft-office-2010 | Microsoft Office 2010 | github.com/mariamsara77/recuva | 🔴 HIGH — Commercial Microsoft software, redistributing from unofficial repo is a copyright violation. | **REMOVE download link immediately.** Link to `microsoft.com` only. |
| 14 | vlc-media-player | VLC media player 3.0.23 | github.com/mariamsara77/recuva | 🟡 MEDIUM — VLC is open-source (LGPL/GPL). Official download domain: `videolan.org`. Unofficial repo used. | Replace with official `videolan.org/vlc/` download link. |
| 13 | libreoffice | LibreOffice 26.2.4 | github.com/mariamsara77/recuva | 🟡 MEDIUM — LibreOffice is open-source (MPL 2.0). Official domain: `libreoffice.org`. Unofficial repo used. | Replace with official `libreoffice.org/download/` link. |
| 3 | avro-keyborad | Avro Keyboard 5.6.0 | github.com/mariamsara77/recuva | 🟡 MEDIUM — Avro is free software. Official domain: `omicronlab.com`. Unofficial repo used. | Replace with official `omicronlab.com` download link. |
| 5 | recuva-delete-files-recover-software | Recuva v155 | github.com/mariamsara77/recuva | 🟡 MEDIUM — Freeware by Piriform/Avast. Official domain: `ccleaner.com/recuva`. The repo name `mariamsara77/recuva` appears to impersonate the product name. Unofficial repo used. | Replace with official `ccleaner.com/recuva` link. |
| 6 | refuse-usb-to-bootable-converter | Refuse USB v4.15 | github.com/mariamsara77/recuva | 🟡 MEDIUM — Original vendor unclear. Unofficial repo used. | Verify original vendor and official source. Replace or remove if unverifiable. |
| 4 | proshika-shabda | Proshika Shabda | github.com/mariamsara77/recuva | 🟡 MEDIUM — License unclear. Proshika Shabda is a legacy Bangla word processor. Official/original source unknown. | Verify license and official distribution rights. Replace or remove if unverifiable. |
| 7 | nikosh-unicode-font | Nikosh Unicode Font | github.com/mariamsara77/recuva | 🟢 LOW — Nikosh font is distributed under **SIL Open Font License (OFL)**. Unofficial repo used. | Replace with official link (e.g., `bdfonts.com` or original OFL source). |
| 9 | solaimanlipi-font | Solaimanlipi | github.com/mariamsara77/recuva | 🟢 LOW — Free Bangla font; license mentioned in API description. Unofficial repo used. | Replace with official source link. |
| 11 | siyam-rupali-bangla-font | Siyam Rupali | github.com/mariamsara77/recuva | 🟢 LOW — Free Bangla font; license mentioned in API description. Unofficial repo used. | Replace with official source link. |
| 12 | hind-siliguri-bangla-font | Hind Siliguri | github.com/mariamsara77/recuva | 🟢 LOW — OFL license (Google Fonts). Official source: `fonts.google.com/specimen/Hind+Siliguri`. Unofficial repo used. | Replace with Google Fonts official link. |
| 10 | kalpurush-bangla-font | Kalpurush | github.com/mariamsara77/recuva | ⚪ NEEDS REVIEW — **License NOT stated in API data.** Kalpurush is commonly redistributed but original author license is unclear. | **License needs human review** before any redistribution. |
| 8 | sutonnymj | SutonnyMJ | github.com/mariamsara77/recuva | ⚪ NEEDS REVIEW — **License NOT stated in API data.** SutonnyMJ is a legacy ANSI Bangla font; licensing unclear. | **License needs human review** before any redistribution. |

---

## Content Policy Flags

No pages in `/software/[slug]` were found to contain the words "crack", "keygen", "patch", "full version free", or "zip file free" in their page code (audit of static page files).
API description content was not modified during this pass.

---

## Action Required (Human Decision)

1. **Immediately investigate the 3 HIGH-risk entries** (Bijoy Bayanno, Office 2007, Office 2010) — remove unofficial download links from admin panel.
2. **Replace MEDIUM-risk open-source links** with official vendor domains listed above.
3. **Verify licenses** for Kalpurush and SutonnyMJ before redistribution.
4. **Consider removing** the GitHub repo `mariamsara77/recuva` as a download source for all 15 entries.
5. No page content was modified during this audit pass. Changes must be made in the admin panel.
