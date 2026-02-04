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
        <Header
          title="Simagang Dashboard"
          date={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          userName={user.full_name || "User"}
          userRole={user.role || "magang"}
        />
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
