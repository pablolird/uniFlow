import { BrowserRouter, Outlet, Route, Routes } from "react-router";
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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RequestProvider>
                <Outlet />
              </RequestProvider>
            }
          >
            <Route index element={<DashboardRoute />} />
            <Route path="close_request/:requestId" element={<CloseRequest />} />
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
