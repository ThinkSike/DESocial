# Bare React Native migration plan (living draft)

## Status
- Branch: `migration/bare-react-native`
- Scope: **in-place conversion** of `apps/mobile` from Expo → bare React Native (RN CLI)

---

## Summary
We currently have an Expo (SDK 54) app at `apps/mobile` (Expo Router + several Expo modules). You want to migrate to **bare React Native** (no Expo Go, no Expo-managed runtime).

You also want **iOS + Android + Web**, but web is **not** intended to be a 1:1 mirror of mobile (some content/features will be web-only).

This document captures:
- decisions you already made
- open decisions I need from you before implementing anything that locks us in
- a phased migration approach that minimizes dead-ends

---

## Goals
- Convert `apps/mobile` into a **bare RN CLI** app with native projects:
  - `apps/mobile/android`
  - `apps/mobile/ios`
- Keep working monorepo + shared code via `packages/shared`.
- Maintain feature parity for existing **mobile** functionality (auth, feeds, posts, uploads) unless you explicitly choose to drop something.
- Introduce/maintain **web** support, acknowledging it will have **different routes/content** than mobile.

## Non-goals (unless you tell me otherwise)
- Major backend refactors in `apps/server` (except for any unavoidable CORS / upload / URL changes).
- Adding OTA update infrastructure (Expo Updates replacement) during the initial migration.

---

## Confirmed decisions (from you)
1) **Migration strategy:** in-place conversion (no parallel “new mobile app” folder).
2) **Platforms:** iOS + Android + Web.
3) **Web:** required; will serve a different purpose than mobile (not all mobile features).
4) **Versions:** upgrade to the **most stable** React Native version directly.
5) **Architecture choice:** use the most **performance-centric** and **mature** approach.
6) **Expo feature scope:** expect to drop many Expo-provided features; I should ask you what to keep vs remove.

---

## Open decisions I need from you (before implementation)
These are the big ones that affect the whole approach:

### A) Web approach (most important)
Bare RN + “web” can mean two very different architectures:

**Option A1 — Separate web app (recommended given web-only content):**
- Keep `apps/mobile` as *native-only* (RN CLI).
- Create a dedicated `apps/web` (likely Next.js or Vite+React) for web-only UX.
- Share types/schemas via `packages/shared` (and optionally share some UI via a `packages/ui` later).

**Option A2 — Single codebase with React Native Web:**
- Keep one `apps/mobile` app that runs on iOS/Android and also bundles for web using `react-native-web`.
- Use platform routing/feature flags to show different content on web.

✅ **Question:** Do you want **A1 (separate `apps/web`)** or **A2 (React Native Web in the same app)**?

(If you pick A1, it does *not* contradict “in-place conversion” for mobile; it just means web is a separate product surface, which matches your requirement.)

### B) Navigation / routing choice (performance + maturity)
For iOS/Android, the most common mature option is **React Navigation** with native primitives (`react-native-screens`, native stack).
A more “native-first performance” option is **Wix `react-native-navigation`**, but it’s heavier on native setup and ecosystem.

✅ **Question:** Do you prefer:
- **B1:** React Navigation (mature, huge ecosystem, solid performance with `native-stack`)
- **B2:** react-native-navigation (native-driven nav, high performance, more native complexity)

### C) “Most stable RN version” definition
When we start implementation, I’ll align to:
- the latest stable `react-native` release
- the matching supported `react` version (RN sometimes lags React major versions)

✅ **Question:** Are you okay if this means changing React from `19.x` to whatever RN stable supports, if necessary?

### D) New Architecture / Hermes
Performance-centric usually implies Hermes and (possibly) New Architecture, but stability and library compatibility matters.

✅ **Question:** For the initial migration milestone, do you want:
- **D1:** New Architecture OFF (maximize compatibility) then evaluate later
- **D2:** New Architecture ON from day one (opt-in early; may require more troubleshooting)

---

## Expo feature audit (I will not assume — you decide)
Current Expo-related capabilities in `apps/mobile/package.json` and likely replacements:

| Capability | Expo package today | Bare RN replacement candidates | Keep on Mobile? | Keep on Web? |
|---|---|---|---:|---:|
| File-based routing | `expo-router` | React Navigation / RNN | ? | ? |
| Image picking | `expo-image-picker` | `react-native-image-picker` | ? | N/A |
| Image rendering | `expo-image` | RN `<Image>` / `react-native-fast-image` | ? | ? |
| Video | `expo-video` | `react-native-video` | ? | ? |
| Haptics | `expo-haptics` | `react-native-haptic-feedback` | ? | N/A |
| In-app browser | `expo-web-browser` | `Linking.openURL` / in-app browser lib | ? | ? |
| Splash screen | `expo-splash-screen` | `react-native-bootsplash` / native | ? | ? |
| Fonts | `expo-font` | native font linking | ? | ? |
| Constants/env | `expo-constants` + `EXPO_PUBLIC_*` | `react-native-config` / build-time env | ? | ? |
| Status bar/system UI | `expo-status-bar`, `expo-system-ui` | RN `StatusBar` + native config | ? | ? |

✅ **Question:** Tell me which items above are **must-have** vs **nice-to-have** vs **drop** (especially Video, Haptics, In-app browser, custom fonts/splash polish).

---

## Migration plan (phased, in-place)
> I will not start these steps until the “Open decisions” are answered.

### Phase 0 — Design + compatibility checks
- Decide web approach (A1/A2), navigation (B1/B2), New Architecture (D1/D2).
- Choose the “stable” RN target version and confirm React version alignment.
- Identify Expo-only features actually used in code (not just installed).

### Phase 1 — Create a bare RN baseline inside `apps/mobile`
In-place conversion generally means:
- Generate native projects (`android/`, `ios/`) and baseline RN tooling.
- Replace Expo entrypoints with RN entrypoints (`index.js`, App root).
- Keep the monorepo wiring intact (pnpm + Turborepo).

Key risk area: Metro + pnpm workspaces + `packages/shared` resolution.

### Phase 2 — Replace Expo Router with chosen navigation
- Establish a top-level navigation structure.
- Port routing logic from file-based routes → navigation config.

### Phase 3 — Replace Expo modules one-by-one (consult-heavy)
- For each Expo capability we keep, swap to a bare RN equivalent.
- For each capability we drop, remove code and dependencies.
- For ambiguous areas (uploads, permissions, URI handling), I will stop and ask you before committing to an approach.

### Phase 4 — Web implementation
Depending on A1/A2:
- **A1:** scaffold `apps/web` and implement the web-only surface.
- **A2:** configure RN Web bundling/routing and implement web-only content gates.

### Phase 5 — Stabilization
- Debug build pipelines (Android release, iOS build, web build).
- Reduce bundle size and improve runtime performance (profiling-driven).

---

## Areas where I will consult you before writing custom logic
- Upload pipeline (device file URIs → multipart → API → MinIO URLs)
- Permissions UX and exact requirements (photos/camera)
- Any deep linking / universal links expectations
- Web-only content boundaries (what must/ must not appear on mobile)
- Asset pipeline decisions (fonts, splash, icons) and desired polish level

---

## Next action (you)
Reply with:
1) Web approach: **A1** or **A2**
2) Navigation: **B1** or **B2**
3) React version flexibility: ok to align React to RN stable? (yes/no)
4) New Architecture: **D1** or **D2**
5) For the Expo feature audit table: mark each capability as **must-have / nice-to-have / drop**
