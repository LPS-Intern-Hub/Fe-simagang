import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const menuItems = [
    { id: "dashboard", icon: "/images/dashboard.png", label: "Dashboard" },
    { id: "perizinan", icon: "/images/permission.png", label: "Perizinan" },
    { id: "presensi", icon: "/images/absen.png", label: "Presensi" },
    { id: "logbook", icon: "/images/logbook.png", label: "Logbook" },
  ];

  return (
    <aside>
      <div className="brand">
        <img src="/images/navbarLogo.png" alt="SIMAGANG Logo" className="brand-logo" />
        <span className="brand-text">SIMAGANG</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id}`} 
            className={`nav-item ${location.pathname.includes(item.id) ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)} 
          >
            <img src={item.icon} alt={item.label} className="nav-icon" />
            <span style={{ textTransform: "capitalize" }}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button 
        className="btn-logout" 
        onClick={() => {
            localStorage.clear(); 
            navigate('/login');
        }}
      >
        <i className="ri-logout-box-r-line"></i> Keluar
      </button>
    </aside>
  );
};

export default Sidebar;