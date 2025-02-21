// src/components/LandingPage.js
import React from 'react';
import Lottie from 'react-lottie';
import ChatBubble from "../assets/chatbubble.json";
import Books from "../assets/books.json";
import Bookanimation from "../assets/Bookanimation.json";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer"

const LandingPage = () => {
  const chatbubble = {
    animationData: ChatBubble,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const books = {
    animationData: Books,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const bookanimation = {
    animationData: Bookanimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const navigate = useNavigate()
  const location = useLocation();

  return (
    <div data-theme="lofitheme">
      {/* Navbar */}
      <div className="navbar bg-base-100 border-t-2 border-b-2 border-gray-300">
        {/* Left section: The Tattered Page logo */}
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">The Tattered Page</a>
        </div>

        {/* Right section: Icons and links */}
        <div className="flex-none gap-4">
          {/* Links to Bookshelves and Bookclub */}
          <div className="flex gap-4">
            <NavLink to={'/dashboard'} className="btn btn-ghost">Home</NavLink>
          </div>
          <div className="flex gap-4">
            <NavLink to={'/account'} className="btn btn-ghost">Account</NavLink>
          </div>

        </div>
      </div>


      {/* Intro Section */}
      <section className="bg-white text-center text-black py-12">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-semibold">Welcome to The Tattered Page</h2>
          <p className="mt-4 text-lg">
            Get lost in the world of books—discover new titles, connect with fellow readers, and share your thoughts on what you’ve read. Whether you’re looking for recommendations or just want to chat about your latest read, this is the place for you.
          </p>
          <NavLink to={'/dashboard'} className="btn btn-bg-100 mt-6 ">Home</NavLink>
        </div>
      </section>

      {/* Section 1: Explore Books */}
      <section className="bg-secondary text-lofi-background py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">Discover New Books</h2>
          <p className="mt-4 text-lg">
            Search through a vast collection of books fetched from the Google Books API. Whether you're into thrillers, classics, or contemporary reads, you can easily find your next book to read, add it to your bookshelf, and get inspired by recommendations tailored to your preferences.
          </p>
          <div className="flex-shrink-0">
            <Lottie options={bookanimation} height={200} width={200} />
          </div>
         
          <button onClick={(() => navigate("/books", { state: { from: location.pathname } }))}
          className="btn btn-primary mt-6">Browse Books</button>

        </div>
      </section>

      {/* Section 2: Bookshelf Management */}
      <section className="bg-lofi-background py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">Create Your Own Bookshelf</h2>
          <p className="mt-4 text-lg">
            Curate your personal bookshelf, track your reading progress, and organize your books into categories like "Reading," "Completed," and "Wishlist." Keep all your favorite books in one place, and revisit them whenever you want to get nostalgic.
          </p>
          <div className="flex-shrink-0">
            <Lottie options={books} height={150} width={150} />
          </div>
          <NavLink to={"/bookshelves"} className="btn btn-secondary mt-6">Go to Bookshelf</NavLink>
        </div>
      </section>

      {/* Section 3: Community Discussion */}
      <section className="bg-accent text-black py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">Join the Discussion</h2>
          <p className="mt-4 text-lg">
            Engage in live, real-time conversations with your fellow readers. Whether it’s for a group discussion or a one-on-one chat, the app keeps your conversations flowing smoothly. So, grab your coffee and chat about your favorite chapters!
          </p>
          <div className="flex-shrink-0">
            <Lottie options={chatbubble} height={150} width={150} />
          </div>
          <NavLink to={'/bookclubs'}>
          <button className="btn btn-secondary mt-6">Join Now</button>
          </NavLink>
        </div>
      </section>

    
      <Footer/>
    </div>
  );
};

export default LandingPage;