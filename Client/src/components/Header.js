import React from "react";
import headerBackground from "../assets/headerBackground.jpg";  
import Navbar from "../NavBar";

function Header() {
  return (
    <div>
      {/* Background image section */}
      <div
        style={{
          backgroundImage: `url(${headerBackground})`,
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          height: "140px", 
        }}
      >
      </div>
      
      {/* Sticky Navbar */}
      <div className="navbar bg-base-100 border-t-2 border-b-2 border-gray-300 sticky top-0 z-10">
        <Navbar />
      </div>
    </div>
  );
}

export default Header;
