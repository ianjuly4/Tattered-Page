import React from "react";
import Header from "./Header";
import bookNook from "../assets/bookNook.jpg";
import animecoffeeshop from "../assets/animecoffeeshop.jpg";
import library from "../assets/library.jpg"
import { NavLink } from "react-router-dom";
import Footer from "./Footer"

function Home() {

  return (
    <div>
      <div className="top-0 z-10">
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

      {/* Bookshelves Hero Section */}
      <div className="hero bg-base-100 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          {/* Left side image */}
          <div className="flex justify-center lg:justify-start lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={library} // New image for Bookshelves section
              alt="Bookshelves"
              className="max-w-lg rounded-lg shadow-2xl"
            />
          </div>

          {/* Right side text */}
          <div className="text-center lg:text-left lg:w-1/2 px-4 py-8">
            <h1 className="text-5xl font-bold mb-6">Bookshelves</h1>
            <p className="py-6">
              Whether you're a casual reader or a passionate bibliophile, your bookshelf is your personal space to explore, organize, and cherish every story. With Bookshelves, you can keep track of your favorite reads, discover new gems, and build the ultimate collection of books you've always wanted.
            </p>
            <p className="mt-4">Here’s what you can do:</p>
            <ul className="mt-4 list-disc pl-6">
              <li>Organize Your Collection: Create shelves for your current reads, wish list, or books you’ve already devoured.</li>
              <li>Book Progess: Track your book progess.</li>
            </ul>
            <p className="mt-4">Ready to start building your perfect bookshelf? Dive in and make your library truly yours!</p>
            <div className="text-center mt-4">
              <NavLink to="/bookshelves">
                <button className="btn btn-primary mt-4">
                  Explore Bookshelves
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bookclub Section*/}
      <div className="hero bg-primary min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          {/* Left side text */}
          <div className="text-center lg:text-left lg:w-1/2 px-4 py-8">
            <h1 className="text-5xl font-bold mb-6">Bookclub</h1>
            <p className="py-6">
              Looking for your next great read? Or perhaps a cozy community to share your thoughts with? Bookclub is the perfect place for book lovers like you! Whether you're diving into a thrilling novel, or exploring thought-provoking nonfiction, we've got a club for everyone.
            </p>
            <p className="mt-4">
              Here’s what you can expect:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Create Clubs: Create your own to bookclubs with your favorite reads, similar books, or similar genres</li>
  
            </ul>
            <p className="mt-4">
              Start your reading journey today – your next favorite book is just a click away!
            </p>

            {/* Wrap the button with NavLink */}
            <NavLink to="/bookclubs">
              <button className="btn btn-secondary mt-4">
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
      <Footer/>
    </div>
  );
}

export default Home;
