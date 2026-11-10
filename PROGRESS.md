# Totthobox SEO & AdSense Compliance Progress

## Checklist

### Phase 1: Trust & Compliance Files
- [x] Create `public/ads.txt`
- [x] Remove global meta keywords from `app/layout.tsx`
- [x] Create `/editorial-policy` page (`app/(home)/editorial-policy/page.tsx`)
- [x] Update `/privacy-policy` with AdSense, vendor, CMP and opt-out links
- [x] Rewrite `/about-us` (authentic mission, editorial team, verification, SSR, no fake stats)
- [x] Update `/contact-us` with real contact channels and editorial grievance contact
- [x] Update `/disclaimer` (general, tax, Islamic, emergency, calculation estimates)
- [x] Update `components/Footer.tsx` with all policy and compliance links
- [x] Run `npm run lint` & `npm run build` for Phase 1
- [x] Git commit `phase-1: trust and compliance files`

### Phase 2: Fake Claims & Client-Only Rendering Fix
- [ ] Remove `113.29k+` fallback and `লক্ষাধিক মানুষ` claim from Home & `UserAnalytics`
- [ ] Remove hardcoded stats (110k, 12.5k, etc.) from `AboutUs`
- [ ] SSR initial contacts in `/contact/[slug]`
- [ ] SSR initial signs list in `/signs/[category]`
- [ ] SSR current holidays and editorial guide in `/bangla/calendar`
- [ ] Run `npm run lint` & `npm run build` for Phase 2
- [ ] Git commit `phase-2: fake claims removal and server-side rendering fixes`

### Phase 3: Indexing Control
- [ ] Thin-guard utility (`<300` words -> `noindex`)
- [ ] Noindex on `/news/headlines*` routes and ads disabled
- [ ] Verify `noindex, nofollow` on private/auth/settings/ai/messages routes
- [ ] Update `sitemap.ts` and `robots.ts` to exclude noindex URLs
- [ ] Git commit `phase-3: indexing control and thin guard`

### Phase 4: Tools & Converters Content
- [ ] Create reusable `<ToolGuide />` / `<EditorialSection />` and `lib/content/*`
- [ ] Tools 10 pages: 700-1200w guide, worked examples, 5+ FAQs, JSON-LD
- [ ] Converters 18 pages: 700-1000w guide, formulas, examples, FAQs
- [ ] PDF editor & International tools guide
- [ ] Git commit `phase-4: rich content depth for tools and converters`

### Phase 5: Listing Page Editorial Wrappers
- [ ] Editorial wrappers & FAQs for `/bangladesh/*` listings
- [ ] Editorial wrappers & FAQs for `/islam/*` listings
- [ ] Editorial wrappers & FAQs for `/software/all` & platforms
- [ ] Editorial wrappers & FAQs for `/bangla/holiday`
- [ ] Git commit `phase-5: listing pages editorial wrappers`

### Phase 6: YMYL Protection
- [ ] Tax/VAT calculator: NBR disclaimer, source link, last updated
- [ ] Islamic pages: authentic references and disclaimer
- [ ] Emergency contacts: official hotline disclaimer
- [ ] Software: official download links only notice
- [ ] Git commit `phase-6: ymyl safety disclaimers and source citations`

### Phase 7: Ad Slots Component
- [ ] Implement `<AdSlot />` (guarded by `NEXT_PUBLIC_ADS_ENABLED=false`, thin-page guard, max 2-3 per page)
- [ ] Place AdSlots only on verified slot candidates
- [ ] Git commit `phase-7: ads compliance and single adslot component`

### Phase 8: Final Verification & Audit
- [ ] Verification script `scripts/audit-pages.mjs`
- [ ] Run full build and lint
- [ ] Generate word count and compliance table in `AUDIT_REPORT.md`
- [ ] Git commit `phase-8: final verification and audit report`

---

## NEXT STEP
Execute Phase 1 tasks: `public/ads.txt`, `app/layout.tsx` keywords removal, `/editorial-policy`, `/privacy-policy`, `/about-us`, `/contact-us`, `/disclaimer`, `components/Footer.tsx`.
