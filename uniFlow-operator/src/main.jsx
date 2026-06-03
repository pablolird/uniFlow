import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "@/index.css";
import DashboardRoute from "@/routes/DashboardRoute.jsx";
import RequestProvider from "@/context/RequestContext.jsx";
import Login from "@/routes/Login.jsx";
import ProtectedRoute from "@/routes/ProtectedRoute.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import CloseRequest from "@/routes/CloseRequest.jsx";
import ScheduleRequest from "@/routes/ScheduleRequest.jsx";
import ShowRequest from "@/routes/ShowRequest.jsx";
import Assets from "./routes/Assets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AssetDetails from "./routes/AssetDetails";
import Technicians from "./routes/Technicians";
import TechnicianDetails from "./routes/TechnicianDetails";
import Analytics from "./routes/Analytics";
import AppLayout from "@/components/AppLayout";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RequestProvider>
                <AppLayout />
              </RequestProvider>
            }
          >
            <Route
              path="assets"
              element={
                <QueryClientProvider client={queryClient}>
                  <Assets />
                </QueryClientProvider>
              }
            />
            <Route
              path="asset/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <AssetDetails />
                </QueryClientProvider>
              }
            />
            <Route
              path="technicians"
              element={
                <QueryClientProvider client={queryClient}>
                  <Technicians />
                </QueryClientProvider>
              }
            />
            <Route
              path="technician/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <TechnicianDetails />
                </QueryClientProvider>
              }
            />
            <Route path="analytics" element={<Analytics />} />
            <Route index element={<DashboardRoute />} />
            <Route
              path="close_request/:requestId"
              element={<CloseRequest />}
            />
            <Route path="show_request/:requestId" element={<ShowRequest />} />
            <Route
              path="schedule_request/:requestId"
              element={<ScheduleRequest />}
            />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
