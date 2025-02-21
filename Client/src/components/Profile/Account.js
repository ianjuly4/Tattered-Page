import React, { useContext, useEffect, useState } from "react";
import Header from "../Header.js";
import { MyContext } from "../../MyContext.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import bookNook from "../../assets/bookNook.jpg";
import AvatarDropdown from "./AvatarDropdown.js";

function Account() {
    const { user, loading, error, setError, deleteAccount } = useContext(MyContext);
    const { bookclubs, bookshelves, accolades, goals, streak, avatar } = user || {};

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        setError(null); 
    }, [location]);

    const backgroundStyle = {
        backgroundImage: `url(${bookNook})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        minHeight: "120vh",
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

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteAccount(user.id);
        }
    };

    return (
        <div>
            <div className="sticky top-0 z-10">
                <Header />
            </div>

            {/* Background div */}
            <div style={backgroundStyle}></div>

            {/* Full-screen container */}
            <div className="hero min-h-screen flex flex-col items-center justify-center">
                <div className="hero-content flex flex-col items-center space-y-6 w-full max-w-4xl px-4 relative">
                    {/* Welcome Message */}
                    <h1 className="text-5xl font-bold text-center">
                        Welcome Back {user?.username}
                    </h1>

                    {/* Avatar Section */}
                    <div className="relative flex flex-col items-center space-y-4">
                        {user && user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="max-w-sm rounded-full shadow-2xl"
                            />
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-primary text-neutral-content w-44 rounded-full">
                                    <span className="text-2xl">{user?.username ? user.username : 'UN'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Avatar Button */}
                    <div className=""> {/* Adjust top and right values as needed */}
                        <AvatarDropdown currentAvatar={user?.avatar} />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6 w-full">
                        {/* Accolades Carousel */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-primary">Accolades</h2>
                            <div className="flex items-center space-x-4">
                                <div className="overflow-x-auto space-x-4">
                                    {accolades && accolades.length > 0 ? (
                                        accolades.map((accolade, index) => (
                                            <div
                                                key={index}
                                                className="w-60 p-4 bg-neutral text-white rounded-xl shadow-lg flex-none"
                                            >
                                                <h3 className="text-xl font-semibold">{accolade.title}</h3>
                                                <p>{accolade.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No accolades yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Goals Carousel */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-primary">Goals</h2>
                            <div className="flex items-center space-x-4">
                                <div className="overflow-x-auto space-x-4">
                                    {goals && goals.length > 0 ? (
                                        goals.map((goal, index) => (
                                            <div
                                                key={index}
                                                className="w-60 p-4 bg-neutral text-white rounded-xl shadow-lg flex-none"
                                            >
                                                <h3 className="text-xl font-semibold">{goal.name}</h3>
                                                <p>{goal.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No goals set yet.</p>
                                    )}
                                </div>
                                <div className="ml-4">
                                    {/*</div>button className="btn btn-secondary btn-sm">Edit Goals</button> */}
                                </div>
                            </div>
                        </div>

                        {/* Streak Section */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-primary">Reading Streak</h2>
                            <p className="text-xl">
                                {streak > 0 ? (
                                    <>Reading Streak: <span className="font-bold text-primary">{streak}</span> days!</>
                                ) : (
                                    <span className="text-white">No reading streaks yet.</span>
                                )}
                            </p>
                        </div>

                        {/* Member Since */}
                        <h1 className="text-xl font-bold">
                            Member since: {new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h1>
                    </div>

                    {/* Delete Account Button */}
                    <button onClick={handleDeleteAccount} className="btn btn-danger btn-secondary btn-sm">Delete Account</button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-6 border-t-4 text-black mt-auto"> {/* mt-auto will push the footer to the bottom */}
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
                </div>
            </footer>
        </div>
    );
}

export default Account;
