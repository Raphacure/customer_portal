# Second Brain: RaphaCure Customer Portal

## 🎯 Current Focus
- Implementing deep linking fallback and mobile app promotion.

## ✅ Project Checklist
- [x] Create catch-all route `app/[...slug]/page.tsx` for deep link fallback.
- [x] Design "Open in App" page with Android/iOS download buttons.
- [x] Install `shadcn/ui` components: `Button`, `Card`, `Input`, `Separator`.
- [x] Implement `app/page.tsx` with Hero, Services, and Corporate Wellness sections.
- [x] Update `app/layout.tsx` metadata and styles.
- [x] Place `assetlinks.json` in `public/.well-known/`.
- [x] Place `apple-app-site-association` in `public/.well-known/`.
- [x] Configure `next.config.ts` to serve `apple-app-site-association` as `application/json`.
- [x] Migrated `apple-app-site-association` to a dynamic API route with rewrite to ensure correct `Content-Type`.

## 📝 To-Do List (Next Actions)
- [ ] Implement actual navigation and routing for web users who want to use the portal.
- [ ] Create detailed service pages.
- [ ] Connect to backend for real data.

## 🐞 Known Issues / Refactors
- None currently.

## 🏛️ Architectural Decisions
- **Deep Link Fallback**: Implemented a catch-all route (`[...slug]`) to intercept all non-root traffic. This page prompts users to open the mobile app, assuming most "deep links" are intended for mobile consumption.
- **Mobile First**: The fallback page is designed mobile-first with clear CTA buttons for app stores.
- **UI Stack**: Continued use of `shadcn/ui` and Tailwind CSS.
- **Deep Link Content-Type**: Switched from static file hosting to an API route (`app/api/apple-app-site-association/route.ts`) + Rewrite for `apple-app-site-association`. This guarantees `application/json` Content-Type regardless of upstream proxy or CDN behaviors that might struggle with extensionless files.
