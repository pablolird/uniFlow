# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

There are no test scripts defined.

## Environment

Set `VITE_API_BASE_URL` in `.env` — defaults to `http://localhost:3000`. All API calls and the Socket.io connection target this base URL.

## Architecture

**uniFlow-operator** is the technician-facing dashboard for a service request management system. It is a React 19 + Vite SPA styled with Tailwind CSS and shadcn/ui (new-york style, Lucide icons).

### Route tree

```
/login                          → Login (unauthenticated)
/ (ProtectedRoute)
  └── RequestProvider
      ├── /                     → Dashboard (tabbed by request status)
      ├── /show_request/:id     → ShowRequest (read-only detail)
      ├── /schedule_request/:id → ScheduleRequest (assign technician + date)
      └── /close_request/:id   → CloseRequest (finalize request)
```

`ProtectedRoute` redirects unauthenticated users to `/login`. The `status` query param persists the active Dashboard tab across navigation.

### Context providers

| Context | File | Responsibility |
|---|---|---|
| `AuthContext` | `src/context/AuthContext.jsx` | Auth state, `login()`, `logout()`, `accessToken` |
| `RequestContext` | `src/context/RequestContext.jsx` | All service request state, WebSocket sync, `refetchRequests()` |

`RequestContext` maintains a dual-sync strategy: initial data comes from `GET /v1/service-requests`, then real-time patches arrive via Socket.io. WebSocket payloads are merged with the existing state; incomplete payloads fall back to a full API refetch. The socket joins a `"global"` room on connect.

### Key WebSocket events

- `service-request.updated` — patches a single request in state
- `CLIENT_MEDIA_ADDED` / `TECHNICIAN_MEDIA_ADDED` — triggers toast notification

### API surface

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/auth/login` | Authenticate |
| POST | `/v1/auth/logout` | Logout |
| GET | `/v1/service-requests` | Fetch all requests |
| GET | `/v1/service-requests/:id` | Fetch single request |

### Path alias

`@/*` resolves to `./src/*` (configured in both `vite.config.js` and `jsconfig.json`).

### Component conventions

- shadcn/ui components live in `src/components/ui/` and are added via the shadcn CLI
- Route-level page components are in `src/routes/`
- Shared display components (`RequestInfo`, `ActivityInfo`, `ActivityForm`) are in `src/components/`
- Custom hooks (`useFetch`, `useAuth`, `useRequestState`) are in `src/hooks/`
- Form validation uses React Hook Form + Zod schemas colocated with the form component
