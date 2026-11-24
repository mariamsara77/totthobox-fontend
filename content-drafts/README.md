# Content Drafts & Editorial Expansion Guidelines

This directory contains editorial expansion guidelines, drafts, and enrichment templates for database records that currently have thin content (<300 words).

## Background
Under the Google AdSense and Search Quality Rater Guidelines, programmatic database records with brief descriptions are treated as "thin content". Totthobox automatically suppresses indexation (`noindex, follow`) on pages with fewer than 300 Bengali words.

To promote a record to fully indexed status with active ad slots:
1. Editorial writers expand the record in Laravel Admin (`https://admin.totthobox.com`) to at least 450–600 words.
2. The record must include historical context, real-life utility, verified public contact information, and authentic sources.
3. Once updated in the backend, the Next.js frontend on-demand revalidation (`/api/revalidate`) re-fetches and un-flags the page from `noindex`.

## Included Draft Guides
- `holiday-drafts.md`: Template for public and religious holiday records.
- `establishment-drafts.md`: Template for public institutions, historical monuments, and civic facilities.
- `history-drafts.md`: Template for historical events and archaeological sites.
- `public-figure-drafts.md`: Template for biographical profiles and contributions.
- `islamic-guidelines.md`: Verification protocols for Hadith, Dua, and Fiqh articles.
