import React from "react";
import Header from "./Header";
import bookNook from "../assets/bookNook.jpg";
import animecoffeeshop from "../assets/animecoffeeshop.jpg";
import { NavLink } from "react-router-dom";

function Home() {

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* Hero Section */}
      <div className="hero bg-secondary min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          {/* Left side text */}
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-5xl font-bold">Welcome to The Tattered Page</h1>
            <p className="py-6">Your Cozy Digital Reading Nook 🌙📚</p>
            <p>
              Get ready to dive into a world of books where the stories never end and the conversations are just as captivating. Whether you’re curling up with a good book, discovering your next favorite read, or chatting with fellow book lovers, The Tattered Page is the place where readers like you come together.
              <br />
              Join our community of passionate readers—explore new books, share your thoughts, or simply unwind in a relaxing, lofi-inspired space designed for book lovers. Here, every chapter sparks a new connection. Let's create our own reading adventure. Ready to turn the page? 📖
            </p>
          </div>

          {/* Right side image */}
          <div className="flex justify-center lg:justify-end lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={bookNook}
              alt="book nook"
              className="max-w-lg rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

       {/* Bookshelf section */}
       <div className="bg-primary py-12 text-center">
        <h2 className="text-3xl text-white">Explore our Bookshelf</h2>
        <p className="text-white mt-4">Dive into a collection of books that will spark your imagination!</p>
      </div>


      {/* Bookshelf Section (Bookclub Section) */}
      <div className="hero bg-base-100 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          {/* Left side text */}
          <div className="text-center lg:text-left lg:w-1/2 px-4 py-8">
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

            {/* Wrap the button with NavLink */}
            <NavLink to="/users/:userId/bookclubs">
              <button className="btn btn-primary mt-4">
                Get Started with Bookclubs
              </button>
            </NavLink>
          </div>

          {/* Right side image */}
          <div className="flex justify-center lg:justify-end lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={animecoffeeshop}
              alt="anime coffee shop"
              className="max-w-lg rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

     
      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
