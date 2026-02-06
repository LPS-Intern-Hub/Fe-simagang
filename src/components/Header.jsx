import React from "react";

const Header = ({ title, date, userName, position, avatarUrl }) => {
  return (
    <header>
      <div>
        <h1 className="page-title">Hello, {userName}!</h1>
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
          <p style={{ fontSize: "13px", fontWeight: 700, color: '#1F2937', marginBottom: '2px' }}>{userName}</p>
          <p style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '100%',
            color: '#1F2937',
            opacity: 0.7
          }}>{position}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
