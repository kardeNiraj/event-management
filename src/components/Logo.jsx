import React from "react";

const Logo = ({ className }) => {
  return (
    <div className={`${className}`}>
      <img
        src="/src/assets/logo.png"
        alt="logo of sait"
        className="object-cover"
      />
    </div>
  );
};

export default Logo;
