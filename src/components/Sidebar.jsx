import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: "dashboard", icon: "/images/dashboard.png", iconOren: "/images/dashboardOren.png", label: "Dashboard" },
    { id: "perizinan", icon: "/images/permission.png", iconOren: "/images/perizinanOren.png", label: "Perizinan" },
    { id: "presensi", icon: "/images/absen.png", iconOren: "/images/absensiOren.png", label: "Presensi" },
    { id: "logbook", icon: "/images/logbook.png", iconOren: "/images/logbookOren.png", label: "Logbook" },
    { id: "peraturan", icon: "/images/peraturan.png", iconOren: "/images/peraturanOren.png", label: "Peraturan" },
  ];

  return (
    <aside>
      <div className="brand">
        <img src="/images/navbarLogo.png" alt="SIMAGANG Logo" className="brand-logo" />
        <span className="brand-text">SIMAGANG</span>
      </div>
      <nav>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.id);
          const isHovered = hoveredItem === item.id;
          const shouldShowOrange = isActive || isHovered;

          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
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
            {(user.full_name || 'User').length > 8
              ? (user.full_name || 'User').substring(0, 8).trim()
              : (user.full_name || 'User')}
          </p>
          <p className="sidebar-profile-position">{user.position || 'UI/UX Intern'}</p>
        </div>
        <button
          className="btn-logout-icon"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          title="Keluar"
        >
          <i className="ri-logout-box-r-line"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;