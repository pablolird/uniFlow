# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 5555
npm run build      # Production build (Vite)
npm run lint       # ESLint
npm run preview    # Preview production build
```

## Architecture

This is a minimal React + Vite SPA for submitting maintenance intake forms tied to physical assets accessed via QR codes.

**Routes** (defined in `src/main.jsx`):
- `/` — Welcome screen (`App.jsx`)
- `/v1/assets/:id` — Intake form for a specific asset (`pages/ReportForm.jsx`)
- `*` — 404 (`pages/NotFound.jsx`)

**Data flow:**
1. `ReportForm.jsx` mounts and fetches device metadata from `GET /v1/public/qr/asset/:id` using axios; the asset `id` comes from the URL param.
2. Device data is passed as props to `components/Form.jsx`, which manages submission.
3. On submit, `Form.jsx` does two sequential API calls:
   - `POST /v1/public/intake/{id}/request` — sends contact info, description, and `type: "MAINTENANCE"`
   - `POST /v1/service-requests/{serviceRequestId}/client-media` — uploads media files as `multipart/form-data`
4. On success, renders `components/Success.jsx`.

**State management:** React hooks only (`useState`, `useRef`). Form inputs use uncontrolled components via `useRef`. No context or external store.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin.

## Environment

Requires `.env` with:
```
VITE_API_BASE_URL=http://140.118.154.136:3005
```

All API endpoints are public — no auth tokens needed. Accessed via `import.meta.env.VITE_API_BASE_URL`.
