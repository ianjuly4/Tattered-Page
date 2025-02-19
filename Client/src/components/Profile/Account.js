import React, { useContext, useEffect } from "react";
import Header from "../Header.js";
import { MyContext } from "../../MyContext.js";
import { useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import bookNook from "../../assets/bookNook.jpg"

function Account() {
    const { user, loading, error, setError } = useContext(MyContext);
    const { bookclubs, bookshelves } = user || {};
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    });

    useEffect(() => {
        setError(null); 
    }, [location]);

    const backgroundStyle = {
        backgroundImage: `url(${bookNook})`,
        backgroundSize: "100%",
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
    
      

    return (
        <div>
            <div className="sticky top-0 z-10">
                <Header />
            </div>

            {/* Background div */}
            <div style={backgroundStyle}></div>

            {/* Loading and Error States */}
            {loading && <p className="text-center text-xl">Loading...</p>}
            {error && <p className="text-center text-red-500 text-xl">{error}</p>}

            {/* Full-screen container */}
            <div className="hero  min-h-screen flex flex-col items-center justify-center">
                {/* Profile content container */}
                <div className="hero-content flex flex-col items-center space-y-6 w-full max-w-4xl px-4">
                    {/* Welcome message */}
                    <h1 className="text-5xl font-bold text-center">
                        Welcome Back {user?.username}
                    </h1>

                    {/* Avatar section */}
                    <div className="relative">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="max-w-sm rounded-full shadow-2xl"
                            />
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-primary text-neutral-content w-44 rounded-full">
                                    <span className="text-2xl">
                                        {user?.username ? user.username : 'UN'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Edit Button */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                            <NavLink to="/avatar">
                                <button className="btn btn-secondary btn-sm">Edit</button>
                            </NavLink>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6 w-full">
                        {/* Bookshelves Section */}
                        <div className="flex justify-between items-center w-full">
                            <h1 className="text-3xl font-bold">Bookshelves</h1>
                            <NavLink to={"/bookshelves"}>
                            <button className="btn btn-primary btn-sm">Go To Your Bookshelves</button>
                            </NavLink>
                        </div>

                        {/* Bookshelves Carousel */}
                        <div className="border p-4 rounded-lg bg-white shadow-lg">
                            <div className="flex overflow-x-auto space-x-4">
                                {bookshelves && bookshelves.length > 0 ? (
                                    bookshelves.map((shelf, index) => (
                                        <div key={index} className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                                            <h2 className="text-xl font-semibold">{shelf.name}</h2>
                                            <p>{shelf.description}</p>
                                            <button className="btn btn-primary btn-sm mt-4">View Shelf</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center">
                                        <p>Currently no books on your shelves</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bookclubs Section */}
                        <div className="flex justify-between items-center w-full">
                            <h1 className="text-3xl font-bold">Bookclubs</h1>
                            <NavLink to={"/users/:userId/bookclubs"}>
                            <button className="btn btn-primary btn-sm">Go To Your Bookclubs</button>
                            </NavLink>
                        </div>

                        {/* Bookclubs Carousel */}
                        <div className="border p-4 rounded-lg bg-white shadow-lg">
                            <div className="flex overflow-x-auto space-x-4">
                                {bookclubs && bookclubs.length > 0 ? (
                                    bookclubs.map((club, index) => (
                                        <div key={index} className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                                            <h2 className="text-xl font-semibold">{club.name}</h2>
                                            <p>{club.description}</p>
                                            <button className="btn btn-primary btn-sm mt-4">Join Club</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center">
                                        <p>No Bookclubs found, please join a bookclub.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Member Since */}
                        <h1 className="text-xl font-bold">Member since: {new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                    </div>
                </div>
            </div>
        {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
    );
}

export default Account;
