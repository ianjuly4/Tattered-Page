import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { MyContext } from "../MyContext";
import { useNavigate, useLocation } from "react-router-dom";
import animecoffeeshop from "../assets/animecoffeeshop.jpg";

function Bookclubs() {
  const { user, isLoggedIn } = useContext(MyContext);
  const { bookclubs } = user || {};
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && isLoggedIn) {
      navigate(`/users/${user.id}/bookclubs`);
    } else {
      // Handle non-logged-in users here (maybe show a message or redirect)
    }
    setIsLoading(false);
  }, [user, isLoggedIn]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="hero bg-secondary min-h-screen flex justify-center items-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center w-full flex-grow px-4 py-16">
        {/* Text on the left */}
        <div className="text-center lg:text-center lg:w-1/2">
          <h1 className="text-5xl font-bold mb-6">Bookclub</h1>
          <p className="py-6">
            Looking for your next great read? Or perhaps a cozy community to share your thoughts with? Bookclub is the perfect place for book lovers like you! Whether you're diving into a thrilling novel, exploring thought-provoking nonfiction, or sharing your latest book recommendations, we've got a club for everyone.
          </p>
          <p className="mt-4">
            Here’s what you can expect:
          </p>
          <ul className="mt-4 list-disc pl-6">
            <li>Join or Create Clubs: Find a Bookclub that matches your interests or create your own to gather like-minded readers!</li>
            <li>Interactive Discussions: Engage in lively book discussions, share your thoughts, and get fresh perspectives from fellow members.</li>
            <li>Read & Share: Track your reading progress, share reviews, and explore exciting new genres with fellow bibliophiles.</li>
          </ul>
          <p className="mt-4">
            Start your reading journey today – your next favorite book is just a click away!
          </p>

          <div className="text-center mt-4">
            <button
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
              className="btn btn-primary mt-4"
            >
              Login To Get Started
            </button>
          </div>
        </div>

        {/* Image on the right */}
        <div className="flex justify-center lg:justify-center lg:w-1/2 mt-6 lg:mt-0">
          <img
            src={animecoffeeshop}
            alt="anime coffee shop"
            className="w-full max-w-3xl  rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black mt-auto">
        <div className="container mx-auto text-center">
          <p>
            &copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for
            book lovers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Bookclubs;
