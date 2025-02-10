import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function Avatars() {
    const { user } = useContext(MyContext);
    const [avatars, setAvatars] = useState([]);

    const navigate = useNavigate()
    
    useEffect(()=>{
            if (!user) {
                navigate("/auth/login");  
            }
            })      

    useEffect(() => {
        fetch("https://api.dicebear.com/9.x/adventurer/svg")
          .then((r) => r.json())
          .then((avatar) => {
            setAvatars(avatar);
          })
          .catch((error) => {
            console.error("Error fetching avatars:", error);
          });
      }, []);

    return (
        <div>
            <div className="sticky top-0 z-10">
                <Header />
            </div>
            
            <div className="hero bg-secondary min-h-screen">
                <div className="hero-content flex-col lg:flex-row">
                    <h1 className="text-5xl font-bold">Avatars</h1>
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {/* Map through avatars and display them */}
                        {avatars.length > 0 ? (
                            avatars.map((avatar, index) => (
                                <div key={index} className="relative">
                                    {/* Avatar Image */}
                                    <img
                                        src={avatar}
                                        alt={`Avatar ${index}`}
                                        className="max-w-sm rounded-full shadow-2xl"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-xl">Loading Avatars...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Avatars;
