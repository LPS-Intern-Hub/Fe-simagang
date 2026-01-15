import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Perizinan from "./pages/Perizinan";
import Presensi from "./pages/Presensi";
import Logbook from "./pages/Logbook";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const MainLayout = ({ children, activeTab, setActiveTab }) => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, backgroundColor: "#F4F7FE" }}>
        <Header
          title="Simagang Dashboard"
          date={new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          userName={user.full_name || "User"}
          userRole={user.position || "Intern"}
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
        {/* Public Route - Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
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
          path="/presensi"
          element={
            <ProtectedRoute>
              <MainLayout activeTab="presensi" setActiveTab={setActiveTab}>
                <Presensi />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route - Check if logged in */}
        <Route 
          path="/" 
          element={
            localStorage.getItem('token') 
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all - redirect to login or dashboard */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('token') 
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;