import React, { useContext, useEffect } from "react";
import Header from "./Header.js";
import { MyContext } from "../MyContext.js";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Account() {
    const { user, loading, error } = useContext(MyContext);
    const { bookclubs, bookshelves } = user || {};

    console.log(user)
    
    const navigate = useNavigate();

    useEffect(()=>{
        if (!user) {
            navigate("/auth/login");
             
        }
        })  

    return (
        <div>
            <div className="sticky top-0 z-10">
                <Header />
            </div>
            
            {/* Loading and Error States */}
            {loading && <p className="text-center text-xl">Loading...</p>}
            {error && <p className="text-center text-red-500 text-xl">{error}</p>}
            
            <div className="hero bg-secondary min-h-screen">
                <div className="hero-content flex-col lg:flex-row">
                    <h1 className="text-5xl font-bold">Welcome Back {user?.username}</h1>

                    <div className="relative">
                    {/* Avatar Image */}
                    {user?.avatar ? (
                        <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="max-w-sm rounded-full shadow-2xl"
                        />
                    ) : (
                        
                        <div className="avatar placeholder">
                        <div className="bg-primary text-neutral-content w-44 rounded-full">
                            {/* Display initials */}
                            <span className="text-2xl">
                            {user?.username
                                ? user.username
                                : 'UN'}
                            </span>
                        </div>
                        </div>
                    )}

                    {/* Edit/Delete Buttons */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <NavLink>
                        <button className="btn btn-secondary btn-sm">Edit</button>
                        </NavLink>
                    </div>
                    </div>

                    <div className="space-y-6">
                        {/* Bookshelves Section */}
                        <h1 className="text-3xl font-bold">Bookshelves</h1>
                        <div className="flex overflow-x-auto space-x-4 p-4">
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
                                    <p>No bookshelves found. Please try a different search.</p>
                                </div>
                            )}
                        </div>

                        {/* Bookclubs Section */}
                        <h1 className="text-3xl font-bold">Bookclubs</h1>
                        <div className="flex overflow-x-auto space-x-4 p-4">
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

                        {/* Member Since */}
                        <h1 className="text-2xl font-bold">Member since: {new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
