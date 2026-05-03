# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (choose platform interactively)
npm start

# Run on specific platform
npm run ios
npm run android

# Lint
npm run lint
```

There is no test suite configured.

## Environment

Requires a `.env` file (or Expo env config) with:
```
EXPO_PUBLIC_API_BASE_URL=<backend URL>
```

All API calls read from `process.env.EXPO_PUBLIC_API_BASE_URL`. The `EXPO_PUBLIC_` prefix makes it available at runtime in Expo.

## Architecture

**Expo Router (file-based routing)**
- `app/_layout.jsx` — root layout; wraps everything in `AuthProvider`, mounts a global `<Title />` header, and handles auth-guarded redirects (unauthenticated → `/signin`, authenticated → `/`).
- `app/signin.tsx` — public login screen.
- `app/(tabs)/` — protected tab shell; wraps both tabs in `ServiceRequestsProvider`.
  - `(index)/` — "Scheduled" tab (PENDING / SCHEDULED / IN_PROGRESS requests).
  - `finished.tsx` — "Finished" tab (RESOLVED / CLOSED requests).
  - `(index)/activity/[id].tsx` — activity detail + in-progress form.
  - `(index)/scan/QRScanner.jsx` — full-screen QR camera; emits `qr-scanned` or `qr-scanned-finish` via `DeviceEventEmitter`.

**State / Data layer**
- `contexts/AuthContext.tsx` (`useSession`) — JWT access token, technician ID, and `login()`. Tokens are **in-memory only** (no persistence across app restarts).
- `contexts/ServiceRequestsContext.tsx` (`useServiceRequests`) — fetches and caches scheduled/finished `ServiceRequest[]` from the API; provides `refreshRequests()`.
- `services/api.ts` — the `ServiceRequest` TypeScript interface (the single source of truth for API shape) and `fetchTechnicianServiceRequests`.

**QR flow**
Starting an activity: `[id].tsx` pushes to `QRScanner` with `mode: "start"` → scanner emits `qr-scanned` → listener in `[id].tsx` validates the token against `request.asset.qr_token` and PATCHes status to `IN_PROGRESS`.
Finishing an activity: same pattern with `mode: "finish"` / `qr-scanned-finish` → PATCHes to `RESOLVED`, optionally POSTs a follow-up, then uploads media.

**Styling**
NativeWind v4 (Tailwind CSS for React Native). Use `className` props for styling. Import `global.css` once per screen that needs it. Inline `StyleSheet` is used in a few legacy spots but prefer `className`.

## Key type: `ServiceRequest`

Defined in `services/api.ts`. The `asset` field currently **does not include `qr_token`** in the type, but the field is used at runtime — add it to the interface if you need type-safe access:

```ts
asset: {
  id: string;
  name: string;
  model: string;
  company_name: string;
  location_lng: string;
  location_lat: string;
  location_address: string;
  qr_token: string; // add this
};
```

## Keyboard handling

Screens with text inputs must use `KeyboardAvoidingView` (with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`) wrapping a `ScrollView` with `keyboardShouldPersistTaps="handled"` to prevent the keyboard from obscuring focused fields.
