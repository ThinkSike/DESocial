# Bare React Native migration plan (draft)

## Summary
We currently have an Expo (SDK 54) app at `apps/mobile` using Expo Router and several Expo modules. The goal is to migrate to a **bare React Native (RN CLI) app** that you can run directly on a simulator/device without Expo Go.

This document is a **draft**. I’m intentionally flagging decisions that need your input before we start making irreversible choices.

---

## Goals
- Replace the Expo-managed mobile app with a **bare RN CLI** app.
- Keep existing product behavior (auth, feeds, uploads, etc.) working against the current Hono backend.
- Keep the monorepo structure and continue to share types/schemas via `packages/shared`.
- Be able to run locally on:
  - Android emulator / physical Android device (Windows-friendly)
  - iOS simulator/device (requires Mac tooling; decision needed)

## Non-goals (unless you tell me otherwise)
- Rebuilding or changing the backend (`apps/server`) beyond any CORS / networking fixes.
- Adding push notifications, analytics, or OTA update systems during the migration.
- Preserving Expo web output (Expo made web easy; bare RN web is a separate decision).

---

## Decision checkpoints (need your answers)
### 1) Migration strategy
**A. Parallel app (recommended):** Create a new RN CLI app (e.g. `apps/mobile-native`) and port screens incrementally.
- Pros: lower risk; Expo app remains a working reference; easier rollback.
- Cons: temporary duplication.

**B. In-place conversion:** Attempt to “eject”/convert `apps/mobile` directly.
- Pros: fewer folders.
- Cons: higher risk; harder to keep the app runnable throughout.

✅ **Question:** Do you want **A** (parallel app) or **B** (in-place)?

### 2) Platform scope
✅ **Question:** Should we target **Android first** and defer iOS until later, or do both in parallel?

### 3) Web support
The current Expo app includes web dependencies (`react-dom`, `react-native-web`).
✅ **Question:** Do you need to keep a **web build** as part of this project after moving to bare RN?

### 4) React Native version / New Architecture
Current Expo app uses `react-native@0.81.5`.
✅ **Question:** Do you want the new bare app to stay on **RN 0.81.x**, or are you okay upgrading RN during the migration? Also: enable **New Architecture** or keep it off initially?

### 5) Routing
We currently rely on **Expo Router** (file-based routing).
✅ **Question:** Are you okay switching to standard **React Navigation** setup (Stack/Tab + manual route config), or do you want something else?

---

## Inventory: Expo features that will need replacements
From `apps/mobile/package.json`, we will need to replace or reimplement:

- `expo-router` → React Navigation (manual route config)
- `expo-image-picker` → `react-native-image-picker` (or your preferred picker)
- `expo-image` → RN `<Image>` or a dedicated image library (decision)
- `expo-video` → `react-native-video` (likely)
- `expo-haptics` → `react-native-haptic-feedback`
- `expo-web-browser` → `Linking.openURL` and/or `react-native-inappbrowser-reborn`
- `expo-font` → native font linking
- `expo-splash-screen` → `react-native-bootsplash` (or native-only setup)
- `expo-constants` → env/config alternative (likely `react-native-config`)
- `expo-linking` → React Navigation linking + native setup

✅ **Question:** Are there any Expo features you *don’t care about keeping* (e.g. haptics, in-app browser, video), so we can simplify?

---

## Proposed migration steps (high-level)
> I’ll wait for your answers in the “Decision checkpoints” section before executing steps that lock us into a direction.

### Phase 0 — Prep
- Confirm decisions (strategy/platform/web/RN version/routing).
- Identify all app features that touch native APIs (camera roll, video playback, deep links, etc.).

### Phase 1 — Scaffold bare RN app
(If you choose the parallel-app approach.)
- Create `apps/mobile-native` using RN CLI.
- Set up TypeScript, ESLint, and workspace dependencies.
- Configure Metro for pnpm monorepo so `@desocial/shared` resolves and hot reload works.

### Phase 2 — Core app wiring
- Implement navigation shell (tabs/stacks) replacing Expo Router.
- Implement environment config (`API_URL`) replacement for `EXPO_PUBLIC_API_URL`.
- Networking layer: ensure device-to-LAN API calls remain ergonomic.

### Phase 3 — Port features incrementally
- Auth screens + token storage
- Feed / posts list
- Post creation
- Image picking + upload
- Profile/community features

### Phase 4 — Replace Expo-specific modules
- Swap each Expo module to its bare-RN equivalent.
- For any area where Expo provided hidden behavior (permissions, file URI handling, etc.), I’ll pause and consult you before committing to custom implementations.

### Phase 5 — Stabilize + remove Expo app
- Make sure Android release build works.
- If needed, set up iOS.
- Remove `apps/mobile` (Expo) or keep it archived for reference (your call).

---

## Places I expect custom code / non-trivial decisions
I will consult you before implementing any of these because they tend to be app-specific:
- Upload pipeline from local device file URIs → multipart to `apps/server`
- Permissions UX (camera roll access) on iOS/Android
- Deep linking behavior (if used)
- Asset pipeline (fonts/icons/splash)
- Any desire for OTA updates (Expo Updates replacement)

---

## Next action
Reply with answers to the **Decision checkpoints** questions (A/B, Android-first?, web?, RN version/new arch?, routing preference?, which Expo features to drop). Once you confirm, I’ll start implementing Phase 1 in this branch.
