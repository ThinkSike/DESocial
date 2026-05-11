# Bare React Native migration plan (living draft)

## Status
- Branch: `migration/bare-react-native`
- Scope: **in-place conversion** of `apps/mobile` from Expo → bare React Native (RN CLI)

---

## Summary
We currently have an Expo (SDK 54) app at `apps/mobile` (Expo Router + Expo modules). The goal is to migrate to **bare React Native** (RN CLI; no Expo Go; no Expo-managed runtime) while keeping **iOS + Android + Web** support.

Web will not be a 1:1 mirror of mobile: some content will be **web-only** and some mobile content may be hidden on web.

---

## Goals
- Convert `apps/mobile` into a bare React Native app with:
  - `apps/mobile/android`
  - `apps/mobile/ios`
- Keep the monorepo + shared code via `packages/shared`.
- Preserve existing mobile product behavior unless explicitly dropped.
- Keep web support via **React Native Web** (single codebase), with platform-gated routes/content.

## Non-goals (unless you tell me otherwise)
- Major backend refactors in `apps/server` (except unavoidable CORS / URL / upload tweaks).
- Adding OTA updates during initial migration.

---

## Confirmed decisions (from you)
- **Web approach:** **A2** — one codebase using `react-native-web` (not a separate web app).
- **Navigation:** **B1** — React Navigation.
- **Versioning principle:** prioritize **maximum stability** over chasing newest versions; align `react` to whatever the chosen stable RN version requires.
- **Architecture:** **D2** — enable the **New Architecture** from the start (acceptable risk on this branch).
- **Replacements you want:**
  - Image picker: `react-native-image-picker`
  - Images: `react-native-fast-image`
  - Video: `react-native-video`
  - Haptics: `react-native-haptic-feedback`
  - In-app browser: I’ll choose a mature option (plan below)
  - Splash: `react-native-bootsplash`
  - Fonts: native font linking
  - Env/config: `react-native-config`
  - Status bar/system UI: RN `StatusBar` + native config
- **Routing preference:** file-based routing is highly desired.

---

## Key architecture notes (what this implies)
### 1) React Native Web (A2) is still a “web app” build pipeline
Even with a single codebase, we still need a web bundler/dev server. The plan is to:
- run the same component tree on web using `react-native-web`
- use React Navigation on web with linking
- platform-gate content/routes so web-only UX can exist

**Open (small) choice we’ll make during Phase 0:** pick the web bundler approach (Vite vs Webpack vs other). I’ll default to the most stable/boring choice that works well with RN Web.

### 2) File-based routing without Expo Router
Expo Router is a major Expo-specific piece. Since you want file-based routing but we’re going bare RN, we will need one of these:
- **Custom route codegen**: keep `apps/mobile/app/**` as the source of truth and generate a React Navigation route config.
- **Manual routes** (fallback): React Navigation config written by hand.

Given your preference, we’ll plan on **custom route codegen**, but we’ll design the conventions with you first (because this is “custom code”).

---

## Library plan (agreed replacements)
### Navigation / routing
- **React Navigation** (B1)
- **File-based routing layer:** custom generator → React Navigation route config
- **Web routing:** React Navigation linking config + web entry

### Media
- **Pick images:** `react-native-image-picker`
- **Render images:** `react-native-fast-image` (native). On web, we’ll fall back to standard RN `<Image>` behavior unless you want a dedicated web image strategy.
- **Video:** `react-native-video` (native). For web, we may need a platform-specific wrapper (because web video is an HTML `<video>` under the hood).

### Device features
- **Haptics:** `react-native-haptic-feedback`
- **In-app browser:** default plan is `react-native-inappbrowser-reborn` with fallback to `Linking.openURL` where unavailable.

### UX polish
- **Splash:** `react-native-bootsplash`
- **Fonts:** native font linking (iOS `Info.plist` + Android font resources or bundling strategy)
- **Status bar:** RN `StatusBar` + native config

### Config / env
- **`react-native-config`** for native env values
- A small `src/config/env.ts` wrapper to keep a single `API_URL` interface across **native + web**.

---

## Expo feature audit (locked-in for now)
| Capability | Expo today | Replacement | Keep (Mobile) | Keep (Web) | Notes |
|---|---|---|---:|---:|---|
| File-based routing | `expo-router` | React Navigation + custom file-based codegen | Yes | Yes | Requires custom generator + linking config |
| Image picking | `expo-image-picker` | `react-native-image-picker` | Yes | N/A | Native permission + URI differences to handle |
| Image rendering | `expo-image` | `react-native-fast-image` | Yes | Yes* | Web likely uses fallback behavior |
| Video | `expo-video` | `react-native-video` | Yes | Yes* | Web needs wrapper/compat approach |
| Haptics | `expo-haptics` | `react-native-haptic-feedback` | Yes | N/A | |
| In-app browser | `expo-web-browser` | `react-native-inappbrowser-reborn` / `Linking` | Yes | Yes | Web likely just uses normal navigation |
| Splash screen | `expo-splash-screen` | `react-native-bootsplash` | Yes | N/A | Web can have its own loading shell |
| Fonts | `expo-font` | native font linking | Yes | Yes | Web uses CSS/font-face if needed |
| Constants/env | `expo-constants` + `EXPO_PUBLIC_*` | `react-native-config` + env wrapper | Yes | Yes | Web env strategy depends on bundler |
| Status bar/system UI | `expo-status-bar`, `expo-system-ui` | RN `StatusBar` + native config | Yes | N/A | |

`*` = “supported” but may require platform-specific implementation.

---

## Migration plan (phased, in-place)
> Implementation will start only after you confirm the remaining consult-heavy items in Phase 0.

### Phase 0 — Design + consult checkpoints (no refactors yet)
- **File-based routing design** (consult-heavy):
  - Keep existing `app/` directory structure?
  - Dynamic route convention? (`[id].tsx` etc.)
  - Route groups for web-only vs mobile-only content?
- Confirm web-only content boundaries (what appears on web, what must not).
- Pick stable target RN version + matching React version.
- Choose web bundler approach that’s stable with RN Web.
- Validate New Architecture compatibility risks for:
  - `react-native-fast-image`
  - `react-native-video`

### Phase 1 — Replace Expo runtime with bare RN baseline (in `apps/mobile`)
- Add native projects (`android/`, `ios/`) and RN CLI tooling.
- Replace Expo entrypoints with RN entrypoints.
- Keep pnpm workspace + Turborepo wiring intact.

### Phase 2 — Navigation + file-based routing (React Navigation)
- Set up React Navigation.
- Implement the file-based route generator (after we agree on conventions).
- Add linking config so routes work on web.

### Phase 3 — Swap Expo modules → chosen libraries
- Replace image picking, image rendering, video, haptics, splash, env, etc.
- Add necessary native configuration (Info.plist, Android manifest, Gradle).

### Phase 4 — Web support (RN Web)
- Add web entry and bundler config.
- Implement platform-gated route registration:
  - web-only screens/routes
  - mobile-only screens/routes

### Phase 5 — Stabilization + performance
- Ensure all three targets build/run.
- Profile performance and address bottlenecks.

---

## Consult-heavy items (I will stop and ask you before coding)
- File-based routing conventions and route group design (web-only vs mobile-only)
- Upload pipeline from device file URIs (esp. image-picker) → multipart → API
- Permissions UX requirements (photos/camera)
- Web-only content requirements and navigation rules

---

## Next action (you)
Answer these so Phase 0 can be finalized:
1) For file-based routing, do you want to keep the current Expo Router-style conventions (like `app/(tabs)/index.tsx`, `app/posts/[id].tsx`), or do you want a simpler convention?
2) How do you want to express web-only vs mobile-only routes in the file tree (e.g. `app/(web)/**` and `app/(mobile)/**`, or `*.web.tsx` / `*.native.tsx` patterns)?
3) Is the web surface authenticated (requires login) or public/SEO-oriented?
