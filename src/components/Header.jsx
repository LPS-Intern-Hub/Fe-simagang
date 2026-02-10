import React from "react";

const Header = ({ title, date, userName, position, avatarUrl }) => {
  return (
    <header>
      <div>
        <h1 className="page-title">Hello, {userName}!</h1>
      </div>
    </header>
  );
};

export default Header;

