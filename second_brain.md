# Second Brain: RaphaCure Customer Portal

## 🎯 Current Focus
- implementing deep linking configuration for Android and iOS.

## ✅ Project Checklist
- [x] Place `assetlinks.json` in `public/.well-known/`.
- [x] Place `apple-app-site-association` in `public/.well-known/`.
- [x] Configure `next.config.ts` to serve `apple-app-site-association` as `application/json`.

## 📝 To-Do List (Next Actions)
- [ ] Verify deep linking on actual devices (requires deployment).

## 🐞 Known Issues / Refactors
- None currently.

## 🏛️ Architectural Decisions
- Used `public/.well-known` for hosting verification files.
- Configured headers in `next.config.ts` to ensure correct Content-Type for Apple's verification file.
