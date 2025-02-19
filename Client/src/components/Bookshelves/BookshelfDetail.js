import React from "react";
import Header from "../Header";
import library from "../../assets/library.jpg";

function BookshelfDetail(){

    const backgroundStyle = {
        backgroundImage: `url(${library})`,
        backgroundSize: "150%",
        backgroundPosition: "center",
        minHeight: "100vh",
        filter: "blur(6px)",
        opacity: 0.6,
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      };
    return(
        <div>
            <div>
                <Header />
            </div>
                {/* Background */}
             <div style={backgroundStyle}></div>
             
        </div>
    )
}
export default BookshelfDetail