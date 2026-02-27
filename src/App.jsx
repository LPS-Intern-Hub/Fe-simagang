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
import Tasks from "./features/intern/pages/Tasks";
import Peraturan from "./features/intern/pages/Peraturan";

// Shared Pages
import Profile from "./features/shared/pages/Profile";

// Mentor Pages
import MentorDashboard from "./features/mentor/pages/Dashboard";
import MentorLogbookReview from "./features/mentor/pages/LogbookReview";
import MentorPermissionReview from "./features/mentor/pages/PermissionReview";
import MentorTaskManager from "./features/mentor/pages/TaskManager";

// Admin Pages
import AdminDashboard from "./features/admin/Dashboard";
import UserManagement from "./features/admin/UserManagement";
import PermissionManagement from "./features/admin/PermissionManagement";
import InternshipMonitoring from "./features/admin/InternshipMonitoring";
import AnnouncementManagement from "./features/admin/AnnouncementManagement";
import AuditLogs from "./features/admin/AuditLogs";
import AttendanceMonitoring from "./features/admin/AttendanceMonitoring";
import Reporting from "./features/admin/Reporting";


// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Main Layout
const MainLayout = ({ children, activeTab, setActiveTab }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
          path="/tasks"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="tasks" setActiveTab={setActiveTab}>
                <Tasks />
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
          path="/mentor/tasks"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="mentor-tasks" setActiveTab={setActiveTab}>
                <MentorTaskManager />
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

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-dashboard" setActiveTab={setActiveTab}>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-users" setActiveTab={setActiveTab}>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/internships"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-internships" setActiveTab={setActiveTab}>
                <InternshipMonitoring />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-announcements" setActiveTab={setActiveTab}>
                <AnnouncementManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-attendance" setActiveTab={setActiveTab}>
                <AttendanceMonitoring />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="admin-reports" setActiveTab={setActiveTab}>
                <Reporting />
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
