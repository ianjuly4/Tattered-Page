import React, {useContext, useState, useEffect} from "react";
import Header from "./Header";
import oldlibrary from "../assets/oldlibrary.jpg"
import { MyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";

function BookShelves(){
    const { user, isLoggedIn } = useContext(MyContext);
    const {bookclubs} = user || {}
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    

    const navigate= useNavigate()

  useEffect(() => {
    if (user && isLoggedIn) {
      setIsAuthenticated(true);
      navigate(`/users/${user.id}/bookclubs`);
    } else {
      setIsAuthenticated(false);
    
    }
    setIsLoading(false);
  }, [user, isLoggedIn]);



    return(
        <div>
            <div className="sticky top-0 z-10">
                <Header/>
            </div>
            <div className="flex flex-col bg-secondary lg:flex-row items-center lg:items-start justify-between w-full">
            {/* Text on the left */}
            <div className="text-center lg:text-left lg:w-1/2">
                <h1 className="text-5xl font-bold mb-6">Your Personal Bookshelf Awaits</h1>
                <p className="py-6">
                Whether you're a casual reader or a passionate bibliophile, your bookshelf is your personal space to explore, organize, and cherish every story. 
                With Bookshelves, you can keep track of your favorite reads, discover new gems, and build the ultimate collection of books you've always wanted.
                </p>
                <p className="mt-4">
                Here’s what you can do:
                </p>
                <ul className="mt-4 list-disc pl-6">
                <li>Organize Your Collection: Create shelves for your current reads, wish list, or books you’ve already devoured.</li>
                <li>Get Personalized Recommendations: Based on your shelves and preferences, we’ll help you discover your next great read.</li>
                <li>Share Your Reading Journey: Track your progress, add ratings, and share your thoughts with fellow readers.</li>
                </ul>
                <p className="mt-4">
                Ready to start building your perfect bookshelf? Dive in and make your library truly yours!
                </p>

                <div className="text-center mt-4">
                {/*<button
                    onClick={() => navigate("/bookshelves")}
                    className="btn btn-primary mt-4"
                >
                    Start Your Bookshelf Journey
                </button>*/}
                </div>
            </div>

            {/* Image on the right */}
            <div className="flex justify-center lg:justify-end lg:w-1/2 mt-6 lg:mt-0">
                <img
                src={oldlibrary} // Replace with an image that represents bookshelves or reading
                alt="Bookshelf"
                className="max-w-lg rounded-lg shadow-2xl"
                />
            </div>
            </div>
        </div>
    )
}
export default BookShelves