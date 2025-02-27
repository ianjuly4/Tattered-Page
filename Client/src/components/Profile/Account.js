import React, { useContext, useEffect, useState } from "react";
import Header from "../Header.js";
import { MyContext } from "../../MyContext.js";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import bookNook from "../../assets/bookNook.jpg"; 
import AvatarDropdown from "./AvatarDropdown.js";
import Footer from "../Footer.js";

function Account() {
    const { user, loading, error, setError, deleteAccount, logout, setLoading, isLoggedIn,  } = useContext(MyContext);
    const { accolades, goals, books } = user || {};

    const [streak, setStreak] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && !isLoggedIn) {
          navigate("/login");
        }
        setLoading(false);
      }, [user, isLoggedIn, navigate]);
    

    useEffect(() => {
        setError(null); 
    }, [location]);


    useEffect(() => {
        if (books && books.length > 0) {
            const calculateStreak = (books) => {
                const sortedBooks = books.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
                let streakCount = 1;
                let currentDate = new Date(sortedBooks[0].lastReadAt);

                for (let i = 1; i < sortedBooks.length; i++) {
                    const book = sortedBooks[i];
                    const bookDate = new Date(book.lastReadAt);

                   
                    const diffInDays = (currentDate - bookDate) / (1000 * 3600 * 24);
                    if (diffInDays <= 1) {
                        streakCount++;
                        currentDate = bookDate;
                    } else {
                        break; 
                    }
                }
                return streakCount;
            };

            const calculatedStreak = calculateStreak(books);
            setStreak(calculatedStreak); 
        }
    }, [books]);

    const backgroundStyle = {
        backgroundImage: `url(${bookNook})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "125vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      };

    if (loading) {
        return <div>
            <div><Header/></div>Loading...</div>;
    }
    
    if (!user) {
        return <div><div><Header/></div>You need to log in to view this page.</div>;
    }

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteAccount(user.id);
        }
    };

    const handleLogout = () => {
        logout()
    }

    return (
        <div>
            <div className=" top-0 z-10">
                <Header />
            </div>

            {/* Background div with style */}
            <div style={backgroundStyle}></div>

            {/* Main content container */}
            <div className="hero min-h-screen flex flex-col items-center justify-center relative z-10">
                <div className="hero-content flex flex-col items-center space-y-6 w-full max-w-4xl px-4 relative">
                    {/* Welcome Message */}
                    <h1 className="text-5xl font-bold text-center text-white">
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

                    {/* Avatar Buttons (Edit Avatar + Two More Inline Buttons) */}
                    <div className="flex space-x-4">
                        <AvatarDropdown currentAvatar={user?.avatar} />
                        <NavLink to={`/users/${user.id}/bookshelves/`}>
                        <button className="btn btn-secondary btn-sm">Go To Bookshelves</button>
                        </NavLink>
                        <NavLink to={`/users/${user.id}/bookclubs`}>
                        <button className="btn btn-secondary btn-sm">Go To Bookclubs</button>
                        </NavLink>
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
                            </div>
                        </div>

                        {/* Streak Section */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-primary">Reading Streak</h2>
                            <p className="text-xl">
                                {streak > 0 ? (
                                    <>Reading Streak: <span className="font-bold text-white">{streak}</span> days!</>
                                ) : (
                                    <span className="text-white">No reading streaks yet.</span>
                                )}
                            </p>
                        </div>

                        {/* Member Since */}
                        <h1 className="text-xl font-bold text-white">
                            Member since: {new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h1>
                    </div>

                    <button onClick={handleLogout} className="btn btn-danger btn-secondary btn-sm">
                        Logout
                    </button>
                    
                    {/* Delete Account Button */}
                    <button onClick={handleDeleteAccount} className="btn btn-danger btn-secondary btn-sm">
                        Delete Account
                    </button>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default Account;
