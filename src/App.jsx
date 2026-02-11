import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import Sidebar from "./features/shared/components/Sidebar";

// Landing Pages
import Landing from "./features/landing/pages/Landing";
import Login from "./features/landing/pages/Login";
import ResetPassword from "./features/landing/pages/ResetPassword";
import NewPassword from "./features/landing/pages/NewPassword";

// Intern Pages
import Dashboard from "./features/intern/pages/Dashboard";
import Perizinan from "./features/intern/pages/Permission";
import Presensi from "./features/intern/pages/Presensi";
import Logbook from "./features/intern/pages/Logbook";
import Peraturan from "./features/intern/pages/Peraturan";

// Shared Pages
import Profile from "./features/shared/pages/Profile";

// Mentor Pages
import MentorDashboard from "./features/mentor/pages/Dashboard";
import MentorLogbookReview from "./features/mentor/pages/LogbookReview";
import MentorPermissionReview from "./features/mentor/pages/PermissionReview";


// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Main Layout
const MainLayout = ({ children, activeTab, setActiveTab }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const path = window.location.pathname;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, backgroundColor: "#F4F7FE" }}>
        <div style={{ padding: "20px" }}>{children}</div>
      </main>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="dashboard" setActiveTab={setActiveTab}>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/presensi"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="presensi" setActiveTab={setActiveTab}>
                <Presensi />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logbook"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="logbook" setActiveTab={setActiveTab}>
                <Logbook />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/perizinan"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="perizinan" setActiveTab={setActiveTab}>
                <Perizinan />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/peraturan"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="peraturan" setActiveTab={setActiveTab}>
                <Peraturan />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/new-password/:token"
          element={<NewPassword />}
        />

        {/* PROFILE (shared) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="profile" setActiveTab={setActiveTab}>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* MENTOR ROUTES */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="mentor-dashboard" setActiveTab={setActiveTab}>
                <MentorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/logbook-review"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="mentor-logbook" setActiveTab={setActiveTab}>
                <MentorLogbookReview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/permission-review"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="mentor-permission" setActiveTab={setActiveTab}>
                <MentorPermissionReview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
