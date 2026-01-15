import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const menuItems = [
    { id: "dashboard", icon: "dashboard-3", label: "Dashboard" },
    { id: "perizinan", icon: "file-text", label: "Perizinan" },
    { id: "presensi", icon: "map-pin-user", label: "Presensi" },
    { id: "logbook", icon: "book-open", label: "Logbook" },
  ];

  return (
    <aside>
      <div className="brand">
        <i className="ri-flashlight-fill"></i> SIMAGANG
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id}`} 
            className={`nav-item ${location.pathname.includes(item.id) ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)} 
          >
            <i className={`ri-${item.icon}-line`}></i>
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