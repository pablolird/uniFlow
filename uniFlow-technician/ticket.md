# Frontend Integration Ticket: Follow-Up Service Requests

## Overview

When a technician finishes work on a request, they can flag it as needing a follow-up visit. This marks the current request as resolved and simultaneously creates a new, linked request. The operator then finds that new request in the pending queue, schedules it, and assigns a technician. The operator is also responsible for reviewing resolved requests and marking them as `CLOSED` — technicians never do this.

**A follow-up is a brand new service request** — it gets its own ID, its own status lifecycle, and its own scheduled date. It is linked to the original via a `parent_id` field. The original request is resolved as normal; nothing about it changes except it now has a child.

---

## Authentication

All endpoints require a JWT bearer token:

```
Authorization: Bearer <token>
```

Both `OPERATOR` and `TECHNICIAN` roles can call every endpoint listed here. The backend does not restrict these by role — access control is purely by company (the token encodes the user's company and the backend validates that the request belongs to it).

---

## Status Lifecycle (for reference)

```
PENDING → ASSIGNED → SCHEDULED → IN_PROGRESS → RESOLVED → CLOSED
```

---

## The Flow

### Step 1 — Technician finishes work and flags a follow-up

The technician's UI should show a **"Needs follow-up" checkbox** when the request is `IN_PROGRESS`. If checked, the technician must also provide a short reason.

On form submit, call both endpoints — **order does not matter** (see why below):

#### 1a. Create the follow-up request

```
POST /v1/service-requests/:id/follow-up
```

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `followup_reason` | string (5–500 chars) | Yes | Why the follow-up is needed. Maps to the checkbox reason field. |
| `description` | string (10–2000 chars) | Yes | Description for the new service request. Can default to the same as the parent or let the technician write a new one. |
| `technician_id` | UUID string | No | If omitted, the follow-up inherits the same technician as the parent. |
| `scheduled_date` | ISO 8601 string | No | Leave empty — the operator will set this in Step 2. |

**Example body:**
```json
{
  "followup_reason": "Parts not available on site, need to order and return",
  "description": "Continue AC unit repair — install replacement compressor once parts arrive"
}
```

**Response (201):** The full new service request object, including its new `id` and `parent_id` pointing to the original.

**Important constraint:** This endpoint only works when the parent request is `IN_PROGRESS` or `RESOLVED`. Since technicians never mark requests as `CLOSED` (that is the operator's job), the parent will always be in one of those two states when the technician submits, so call order does not matter.

---

#### 1b. Mark the parent request as resolved

```
PATCH /v1/service-requests/:id
```

**Request body:**
```json
{
  "status": "RESOLVED"
}
```

> Technicians only ever move requests to `RESOLVED` — never `CLOSED`. The operator reviews resolved requests and marks them `CLOSED` separately. If the follow-up checkbox is not checked, call only this endpoint.

---

### Step 2 — Operator schedules the follow-up

The operator sees the new follow-up request in the pending queue (`status: PENDING`). They open it and set a date and optionally reassign the technician.

#### Schedule and assign the follow-up

```
PATCH /v1/service-requests/:followUpId
```

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `scheduled_date` | ISO 8601 string | Yes | The new date for the follow-up visit. |
| `technician_id` | UUID string | No | Reassign to a different technician, or omit to keep the inherited one. |
| `status` | string | No | Can set to `ASSIGNED` or `SCHEDULED` after setting the date. |

**Example body:**
```json
{
  "scheduled_date": "2026-05-15T09:00:00.000Z",
  "technician_id": "a1b2c3d4-...",
  "status": "SCHEDULED"
}
```

**Response (200):** The updated service request object.

---

## Listing Follow-Up Requests

To show only pending follow-up requests in the operator's queue, use the list endpoint with filters:

```
GET /v1/service-requests?status=PENDING&rootOnly=false
```

To fetch only the follow-ups of a specific parent request:

```
GET /v1/service-requests?parentId=<parentId>
```

To exclude follow-ups and show only original (root) requests:

```
GET /v1/service-requests?rootOnly=true
```

**Full list query params:**

| Param | Type | Description |
|---|---|---|
| `status` | enum (repeatable) | Filter by status: `PENDING`, `ASSIGNED`, `SCHEDULED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| `parentId` | UUID | Show only follow-ups of this parent |
| `rootOnly` | `"true"` / `"false"` | `"true"` hides all follow-ups; omit or `"false"` to include them |
| `technicianId` | UUID | Filter by assigned technician |
| `from` / `to` | ISO 8601 date | Date range filter |
| `cursor` | string | Pagination cursor from previous response |
| `limit` | number (1–100) | Items per page, default 20 |

---

## Identifying a Follow-Up in the UI

Any service request card response includes these fields you can use:

| Field | Description |
|---|---|
| `parent_id` | Non-null UUID means this is a follow-up request |
| `followup_reason` | The reason the technician gave when creating it |
| `has_followups` | Boolean — true if this request has at least one follow-up child |

Use `parent_id !== null` to render a "Follow-up" badge on the card.

---

## Viewing the Full Request Chain

To show the complete history of a chain (original → all follow-ups) in chronological order:

```
GET /v1/service-requests/:id/chain
```

Pass any ID in the chain — the backend walks up to the root automatically.

**Response:**
```json
{
  "original_id": "uuid-of-root-request",
  "total": 3,
  "chain": [
    {
      "id": "...",
      "status": "CLOSED",
      "description_preview": "AC unit not cooling...",
      "created_at": "2026-04-01T10:00:00.000Z",
      "scheduled_date": "2026-04-05T09:00:00.000Z",
      "followup_reason": null,
      "technician": { "id": "...", "name": "John Doe" }
    },
    {
      "id": "...",
      "status": "CLOSED",
      "description_preview": "Continue AC repair...",
      "created_at": "2026-04-10T10:00:00.000Z",
      "scheduled_date": "2026-04-15T09:00:00.000Z",
      "followup_reason": "Parts not available on site",
      "technician": { "id": "...", "name": "John Doe" }
    },
    {
      "id": "...",
      "status": "PENDING",
      "description_preview": "Final installation...",
      "created_at": "2026-04-20T10:00:00.000Z",
      "scheduled_date": null,
      "followup_reason": "Compressor arrived, needs installation",
      "technician": { "id": "...", "name": "John Doe" }
    }
  ]
}
```

---

## Summary of Endpoints Used

| Step | Who | Method | Endpoint | Purpose |
|---|---|---|---|---|
| 1a | Technician | `POST` | `/v1/service-requests/:id/follow-up` | Create the new linked request |
| 1b | Technician | `PATCH` | `/v1/service-requests/:id` | Mark the original as `RESOLVED` |
| 2a | Operator | `PATCH` | `/v1/service-requests/:followUpId` | Set date and assign technician on the follow-up |
| 2b | Operator | `PATCH` | `/v1/service-requests/:id` | Mark the original as `CLOSED` after review |
| — | Both | `GET` | `/v1/service-requests` | List requests (with filters) |
| — | Both | `GET` | `/v1/service-requests/:id/chain` | View full request history |

---

## Key Rules to Keep in Mind

- **Order does not matter in Step 1:** The follow-up endpoint only rejects parents that are `CLOSED`. Since technicians can never set `CLOSED` — only operators can — the parent will always be `IN_PROGRESS` or `RESOLVED` when the technician submits, so both calls can fire in any order (or in parallel).
- **The follow-up inherits** the company, asset, client, and channel from the parent automatically.
- **`technician_id` is optional** in the follow-up creation — if omitted, the same technician is inherited. The operator can override this in Step 2.
- **`scheduled_date` is optional** in the follow-up creation — leave it empty so the operator sets it in Step 2. The new request will appear as `PENDING` until the operator schedules it.
