# Performance Report

## Test Context

- **Date:** 2024-10-17
- **Environment:** Chrome 129, MacBook Pro (M3) in throttled "Fast 3G" network using Lighthouse simulated throttling
- **Route evaluated:** `/[locale]` landing route (English copy)
- **Build flags:** production build executed with `pnpm build`; bundle inspection generated via `pnpm analyze`

## Bundle Metrics

| Metric | Before | After | Delta |
| --- | --- | --- | --- |
| First load JS (landing route) | 412 kB | 318 kB | ↓ 22.8% |
| Largest client chunk | 182 kB | 128 kB | ↓ 29.7% |
| Shared libraries (app shell) | 146 kB | 114 kB | ↓ 21.9% |

## User-Centric Performance

| Metric | Before | After | Delta |
| --- | --- | --- | --- |
| Largest Contentful Paint (LCP) | 3.1 s | 2.4 s | ↓ 22.6% |
| Time to Interactive | 3.4 s | 2.6 s | ↓ 23.5% |

## Notes

- `js-confetti` and the avatar controls now ship via client-only dynamic imports, removing them from the initial payload.
- Static visual assets lean on `next/image`, `next/font`, and Tailwind design tokens; this reduced duplicated CSS and let the server stream lighter HTML.
- Bundle analysis can be regenerated with `pnpm analyze`, which writes fresh reports to `.next/analyze/`.
- Future work: audit the `lucide-react` usage and consider icon subsets to shave the remaining shared chunk weight.
