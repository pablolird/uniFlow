# uniFlow: Technician Mobile App

React Native (Expo) app for field technicians: view scheduled jobs, scan the device's QR code to start and finish each job, resolve with notes and photos, and create follow-up requests.

```bash
npm install
npx expo start   # scan the QR with Expo Go, or press i / a for a simulator
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the backend's LAN address (e.g. `http://192.168.1.10:3000`) so the phone can reach it. See the [root README](../README.md) for the full system.
