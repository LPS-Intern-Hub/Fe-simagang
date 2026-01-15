import React from "react";

const Header = ({ title, date, userName, userRole, avatarUrl }) => {
  return (
    <header>
      <div>
        <h1 className="page-title">{title} 👋</h1>
        <p className="page-subtitle">
          <i
            className="ri-calendar-line"
            style={{ color: "var(--primary)" }}
          ></i>{" "}
          {date}
        </p>
      </div>

      <div className="user-profile">
        <img
          src={
            avatarUrl ||
            `https://ui-avatars.com/api/?name=${userName}&background=FF6B00&color=fff`
          }
          className="avatar"
          alt="User profile"
        />
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700 }}>{userName}</p>
          <p style={{ fontSize: "10px", color: "#999" }}>{userRole}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
