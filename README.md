<p align="center">
<!-- Replace with UniFlow logo image -->
<!-- Suggested: a clean logo combining a QR code motif with a workflow/flow arrow, centered -->
</p>

![GitHub Created At](https://img.shields.io/github/created-at/pablolird/uniFlow)
![GitHub contributors](https://img.shields.io/github/contributors/pablolird/uniFlow)

---

![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![React Native Badge](https://img.shields.io/badge/React%20Native-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Expo Badge](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=fff&style=for-the-badge)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![TailwindCSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-010101?logo=socketdotio&logoColor=fff&style=for-the-badge)

# UniFlow — Unified Workflow for Technical Service Management

> 🏆 **Winner of the Outstanding Performance Award** — Capstone Project Competition 2025, NTUST

**UniFlow** automates the end-to-end lifecycle of technical service requests. QR codes attached to physical devices (air conditioners, refrigerators, and other equipment) link each asset to its owner company. Scanning a code opens a report form, the request flows through an operator dashboard, and a technician handles the task on-site via a mobile app — with every stage tracked in real time.

---

<div align="center">
  <img height=400 alt="uniflow-poster" src="https://github.com/user-attachments/assets/d718f55e-fb42-4583-88de-4fac661b07f2" />
</div>

---

## 🔄 How It Works

1. **Device Report (Client)** — A QR code is affixed to each device. When the device needs service, anyone can scan the QR code and fill out a short form describing the issue and attaching multimedia.
2. **Operator Dashboard** — All incoming requests land in the operator's web dashboard. The operator reviews the report and assigns the task to an available technician from the database.
3. **Technician Mobile App** — The assigned technician receives the task on their phone, sees where to go and what to do, then scans the device QR code to **start** the task and again to **finish** it.
4. **Real-Time Visibility** — Every stage transition is broadcast instantly via WebSockets so the operator always sees live status.

---

## 🌟 Features

- **QR Code Integration**: Each device has a unique QR code tied to it and its owner company.
- **Multimedia Reports**: Clients can attach photos and videos to their service requests.
- **Operator Assignment**: Operators can browse all technicians and assign tasks directly from the dashboard.
- **Live Status Updates**: Activity states update in real time via Socket.io — no page refreshes needed.
- **QR-Gated Task Flow**: Technicians must scan the device QR code to start and to complete a task, ensuring on-site presence.
- **Full Activity Lifecycle**: Requests move through well-defined stages, all visible to the operator in real time.
- **Cross-Platform**: Web frontends for clients and operators; native mobile app for technicians (iOS & Android via Expo).

---

## 📱 Front-Ends

### 1. Client Form (`uniFlow-client`)

<div align="center">
  <img width="450" height="600" alt="uniflow-client" src="https://github.com/user-attachments/assets/2bbebbf1-f035-42ca-851a-fb24aabaa9f2" />
</div>

A lightweight React web app served when a device QR code is scanned. The client fills out a form describing the issue and can attach photos or videos before submitting.

**Stack:** React 19 · Vite · React Router · Axios

---

### 2. Operator Dashboard (`uniFlow-operator`)

<div align="center">
<img width="550" height="360" alt="uniflow-operator" src="https://github.com/user-attachments/assets/60e26276-c4e0-438d-acc7-6a6de0ecd99c" />
</div>

A full-featured web dashboard where operators manage incoming service requests. Built with real-time Socket.io integration so activity state changes appear instantly across all open sessions.

**Stack:** React 19 · Vite · Tailwind CSS · Radix UI · TanStack Table · Socket.io · Axios

---

### 3. Technician Mobile App (`uniFlow-technician`)


<div align="center">
<img width="250" height="400" alt="uniflow-technician" src="https://github.com/user-attachments/assets/18e299c9-2190-4087-abf9-4614715f2ff0" />
</div>

A React Native mobile app for field technicians. Shows assigned tasks with location and device details, and uses the device camera to scan QR codes at the start and end of each job.

**Stack:** React Native · Expo · Expo Router · NativeWind · expo-camera · expo-image-picker

---

## 🛠️ Technologies

| Layer              | Technology                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| Client Form        | React 19, Vite, React Router, Axios                                         |
| Operator Dashboard | React 19, Vite, Tailwind CSS 4, Radix UI, TanStack Table, Socket.io         |
| Technician App     | React Native, Expo 54, Expo Router, NativeWind, expo-camera                 |
| Real-Time          | Socket.io (WebSockets)                                                      |
| Language           | TypeScript / JavaScript                                                     |
| Backend            | Node.js — see [backend-capstone](https://github.com/vawms/backend-capstone) |

---

## 📂 Project Structure

```
uniFlow/
│
├── api.py                        # Helper script to update API base URL across all frontends
├── start-dev.sh                  # Launches all three apps in a tmux session
│
├── uniFlow-client/               # Client-facing report form (web)
│   └── form-react/
│       └── form-react/
│           ├── src/
│           │   ├── pages/        # ReportForm page
│           │   └── components/   # Form, Success, Loading
│           └── package.json
│
├── uniFlow-operator/             # Operator dashboard (web)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── RequestContext.jsx    # Global state for requests & activities
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       ├── ActivityDetails.jsx
│   │       ├── RequestInfo.jsx
│   │       └── ui/              # Reusable UI primitives (dialog, table, button…)
│   └── package.json
│
└── uniFlow-technician/           # Technician mobile app (React Native / Expo)
    ├── app/                      # Expo Router file-based routing
    │   └── (tabs)/               # Tab screens
    ├── components/               # ActivityInfo, ActivityInProgress, ServiceCard…
    ├── contexts/                 # Auth & activity context providers
    ├── services/                 # API service layer
    └── package.json
```

---

## 🚀 Setup and Installation

### Prerequisites

- Node.js 18+
- npm or a compatible package manager
- Expo Go app (for running the mobile app on a physical device) or an iOS/Android simulator
- Backend running — see [backend-capstone](https://github.com/vawms/backend-capstone)

### 1. Clone the Repository

```bash
git clone https://github.com/pablolird/uniFlow.git
cd uniFlow
```

### 2. Configure the API URL

All three frontends read the backend URL from environment variables. You can update them all at once using the helper script:

```bash
python api.py
```

Or set them manually in each `.env` file:

```
VITE_API_BASE_URL=http://<your-backend-ip>:3000      # for client & operator
EXPO_PUBLIC_API_BASE_URL=http://<your-backend-ip>:3000  # for technician
```

### 3. Install Dependencies

```bash
# Client form
cd uniFlow-client/form-react/form-react && npm install

# Operator dashboard
cd ../../../uniFlow-operator && npm install

# Technician app
cd ../uniFlow-technician && npm install
```

### 4. Run the Apps

**All at once (requires tmux):**

```bash
./start-dev.sh
```

**Individually:**

```bash
# Client form (port 5173)
cd uniFlow-client/form-react/form-react && npm run dev

# Operator dashboard (port 4000)
cd uniFlow-operator && npm run dev -- --port 4000

# Technician mobile app
cd uniFlow-technician && npx expo start
```

Scan the QR code printed by Expo with the **Expo Go** app, or press `i`/`a` to open an iOS/Android simulator.

---

## 🔗 Related

- **Backend**: [vawms/backend-capstone](https://github.com/vawms/backend-capstone)

---

<p align="center">Built for the NTUST Capstone Project Competition 2025</p>
