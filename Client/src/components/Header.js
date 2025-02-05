import React from "react";
import headerBackground from "../assets/headerBackground.jpg";  
import Navbar from "../NavBar";

function Header() {
  return (
    <div>
    <div
      style={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        height: "200px", 
      }}
    >
    </div>
        <div>
        <Navbar />
        </div>
    </div>
  );
}

export default Header;



  
