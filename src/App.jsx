import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Perizinan from "./pages/Permission";
import Presensi from "./pages/Presensi";
import Logbook from "./pages/Logbook";
import ResetPassword from "./pages/ResetPassword";

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
        {path === "/dashboard" ? (
          <Header
            title="Simagang Dashboard"
            date={new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            userName={user.full_name || "User"}
            position={user.position || "Intern"}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
            <div className="user-profile">
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=FF6B00&color=fff`
                }
                className="avatar"
                alt="User profile"
              />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: '#1F2937', marginBottom: '2px' }}>{user.full_name || 'User'}</p>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '100%',
                  color: '#1F2937',
                  opacity: 0.7
                }}>{user.position || 'Intern'}</p>
              </div>
            </div>
          </div>
        )}
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
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
