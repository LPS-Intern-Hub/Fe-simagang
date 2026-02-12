import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { logout } from "../../../services/api";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change & prevent body scroll when open
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Menu items based on role
  const internMenuItems = [
    { id: "dashboard", icon: "/images/dashboard.png", iconOren: "/images/dashboardOren.png", label: "Dashboard" },
    { id: "perizinan", icon: "/images/permission.png", iconOren: "/images/perizinanOren.png", label: "Perizinan" },
    { id: "presensi", icon: "/images/absen.png", iconOren: "/images/absensiOren.png", label: "Presensi" },
    { id: "logbook", icon: "/images/logbook.png", iconOren: "/images/logbookOren.png", label: "Logbook" },
    { id: "peraturan", icon: "/images/peraturan.png", iconOren: "/images/peraturanOren.png", label: "Peraturan" },
  ];

  const mentorMenuItems = [
    { id: "mentor-dashboard", path: "/mentor/dashboard", icon: "/images/dashboard.png", iconOren: "/images/dashboardOren.png", label: "Dashboard" },
    { id: "mentor-logbook", path: "/mentor/logbook-review", icon: "/images/logbook.png", iconOren: "/images/logbookOren.png", label: "Review Logbook" },
    { id: "mentor-permission", path: "/mentor/permission-review", icon: "/images/permission.png", iconOren: "/images/perizinanOren.png", label: "Review Perizinan" },
  ];

  const menuItems = user.role === 'mentor' 
    ? mentorMenuItems 
    : internMenuItems;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <button
          className="mobile-topbar-menu"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu"
        >
          <i className="ri-menu-2-line"></i>
        </button>
        <div className="mobile-topbar-brand">
          <img src="/images/navbarLogo.png" alt="Logo" className="mobile-topbar-logo" />
          <span className="mobile-topbar-title">SIMAGANG</span>
        </div>
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=FF6B00&color=fff&size=32`
          }
          className="mobile-topbar-avatar"
          alt="User"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Overlay with fade */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={mobileOpen ? 'sidebar-open' : ''}>
        {/* Mobile Drawer Header */}
        <div className="sidebar-mobile-header">
          <div className="brand">
            <img src="/images/navbarLogo.png" alt="SIMAGANG Logo" className="brand-logo" />
            <span className="brand-text">SIMAGANG</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Desktop brand (hidden on mobile, shown normally on desktop) */}
        <div className="brand sidebar-desktop-brand">
          <img src="/images/navbarLogo.png" alt="SIMAGANG Logo" className="brand-logo" />
          <span className="brand-text">SIMAGANG</span>
        </div>

        <nav>
          {menuItems.map((item) => {
            const itemPath = item.path || `/${item.id}`;
            const isActive = location.pathname === itemPath || location.pathname.includes(item.id);
            const isHovered = hoveredItem === item.id;
            const shouldShowOrange = isActive || isHovered;

            return (
              <Link
                key={item.id}
                to={itemPath}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={shouldShowOrange ? item.iconOren : item.icon}
                  alt={item.label}
                  className="nav-icon"
                />
                <span style={{ textTransform: "capitalize" }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-profile">
          <div
            className="sidebar-profile-link"
            onClick={() => navigate('/profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1, minWidth: 0 }}
            title="Lihat Profil"
          >
            <img
              src={
                user.avatar_url ||
                `https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=FF6B00&color=fff`
              }
              className="sidebar-avatar"
              alt="User profile"
            />
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">
                {(user.full_name || 'User').length > 12
                  ? (user.full_name || 'User').substring(0, 12).trim() + '...'
                  : (user.full_name || 'User')}
              </p>
              <p className="sidebar-profile-position">{user.position || 'UI/UX Intern'}</p>
            </div>
          </div>
          <button
            className="btn-logout-icon"
            onClick={() => setShowLogoutModal(true)}
            title="Keluar"
          >
            <i className="ri-logout-box-r-line"></i>
          </button>
        </div>

        <ConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={async () => {
            try { await logout(); } catch (e) { /* ignore */ }
            localStorage.clear();
            navigate('/');
          }}
          title="Apakah Anda yakin ingin mengakhiri sesi ini?"
          confirmText="Keluar"
          cancelText="Batal"
          image="/images/logout.png"
          confirmButtonStyle="primary"
        />
      </aside>
    </>
  );
};

export default Sidebar;