import React, { useContext, useState, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import animecoffeeshop from "../../assets/animecoffeeshop.jpg";


function BookclubDetails(){
    const {user, isLoggedIn, setError} = useContext(MyContext)
    const {clubId, userId} = useParams
    const [isLoading, setIsLoading] = useState(true);
    
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            setIsLoading(true); 
        } else {
            setIsLoading(false);
        }
    }, [user]);
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/bookclubs"); 
        }
    }, [isLoggedIn, navigate]);
    
    useEffect(() => {
        setError(null); 
    }, [location]);

    if (isLoading) {
        return <div>Loading....</div>; 
    }


    const backgroundStyle = {
        backgroundImage: `url(${animecoffeeshop})`,
        backgroundSize: "150%",
        backgroundPosition: "center",
        minHeight: "125vh",
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
                <Header/>
            </div>
            <div style={backgroundStyle}></div>
                <footer className="bg-white py-6 border-t-4 text-black">
                    <div className="container mx-auto text-center">
                    <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
                    </div>
                </footer>
        </div>
    )
}
export default BookclubDetails;