import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import ReportForm from "./pages/ReportForm";
import RatingPage from "./pages/RatingPage";
import QrsPage from "./pages/QrsPage";
import NotFound from "./pages/NotFound";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/v1/assets/:id" element={<ReportForm />} />
        <Route path="/v1/rating/:token" element={<RatingPage />} />
        <Route path="/qrs" element={<QrsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
);
