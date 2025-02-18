import React, { useContext, useState, useEffect } from "react";
import Header from "../Header";
import library from "../../assets/library.jpg";
import { MyContext } from "../../MyContext";
import { useNavigate, useLocation } from "react-router-dom";

function BookShelves() {
  const { user, isLoggedIn } = useContext(MyContext);
  const { bookclubs } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isLoggedIn) {
      setIsAuthenticated(true);
      navigate(`/users/${user.id}/bookshelves`);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [user, isLoggedIn]);

  return (
    <div className="bg-secondary min-h-screen flex flex-col"> 
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      
      <div className="flex flex-col mt-28 lg:flex-row items-center lg:items-center justify-center lg:justify-between w-full px-4 flex-grow">
        {/* Text on the left */}
        <div className="text-center lg:text-center lg:w-1/2">
          <h1 className="text-5xl font-bold mb-6">Bookshelves</h1>
          <p className="py-6">
            Whether you're a casual reader or a passionate bibliophile, your bookshelf is your personal space to explore, organize, and cherish every story. With Bookshelves, you can keep track of your favorite reads, discover new gems, and build the ultimate collection of books you've always wanted.
          </p>
          <p className="mt-4">Here’s what you can do:</p>
          <ul className="mt-4 list-disc pl-6">
            <li>Organize Your Collection: Create shelves for your current reads, wish list, or books you’ve already devoured.</li>
            <li>Get Personalized Recommendations: Based on your shelves and preferences, we’ll help you discover your next great read.</li>
            <li>Share Your Reading Journey: Track your progress, add ratings, and share your thoughts with fellow readers.</li>
          </ul>
          <p className="mt-4">Ready to start building your perfect bookshelf? Dive in and make your library truly yours!</p>
          <div className="text-center mt-4">
            <button
              onClick={(() => navigate("/login", { state: { from: location.pathname } }))}
              className="btn btn-primary mt-4"
            >
              Login To Get Started
            </button>
          </div>
        </div>

        {/* Image on the right */}
        <div className="flex justify-center lg:justify-center lg:w-1/2 mt-6 lg:mt-0">
          <img
            src={library} 
            alt="Bookshelf"
            className="w-full max-w-4xl  rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default BookShelves;
