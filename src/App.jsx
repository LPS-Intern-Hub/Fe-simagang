import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Perizinan from "./pages/Perizinan";
import Presensi from "./pages/Presensi";
import Logbook from "./pages/Logbook";


const MainLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, backgroundColor: "#F4F7FE" }}>
        <Header
          title="Simagang Dashboard"
          date="Selasa, 13 Januari 2026"
          userName="Dimas Rizky"
          userRole="Frontend Intern"
        />
        <div className="container" style={{ padding: '20px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Router>
      <Routes>
        {}
        <Route
          path="/dashboard"
          element={
            <MainLayout activeTab="dashboard" setActiveTab={setActiveTab}>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/logbook"
          element={
            <MainLayout activeTab="logbook" setActiveTab={setActiveTab}>
              <Logbook />
            </MainLayout>
          }
        />

        <Route
          path="/perizinan"
          element={
            <MainLayout activeTab="perizinan" setActiveTab={setActiveTab}>
              <Perizinan />
            </MainLayout>
          }
        />

        <Route
          path="/presensi"
          element={
            <MainLayout activeTab="presensi" setActiveTab={setActiveTab}>
              <Presensi />
            </MainLayout>
          }
        />

        {/* DEFAULT: Jika buka web, langsung lempar ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;