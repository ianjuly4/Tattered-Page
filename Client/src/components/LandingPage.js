// src/components/LandingPage.js
import React from 'react';
import Lottie from 'react-lottie';
import ChatBubble from "../assets/chatbubble.json";
import Books from "../assets/books.json";
import Bookanimation from "../assets/Bookanimation.json";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

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
            <NavLink to={'/dashboard'}>
            <a className="btn btn-ghost">Home</a>
            </NavLink>
          </div>
          <div className="flex gap-4">
            <NavLink to={'/account'}>
            <a className="btn btn-ghost">Account</a>
            </NavLink>
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
          <NavLink to={"/dashboard"}>
          <button className="btn btn-accent mt-6">Let's Get Started</button>
          </NavLink>
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
          <NavLink to={"/bookshelves"}>
          <button className="btn btn-secondary mt-6">Go to Bookshelf</button>
          </NavLink>
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
          <button className="btn btn-secondary mt-6">Join Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;





/*"Get lost in the world of books—discover new titles, connect with fellow readers, and share your thoughts on what you’ve read. Whether you’re looking for recommendations or just want to chat about your latest read, this is the place for you."

Features of the Virtual Book Club App
Welcome to your cozy corner of the internet—a place where books come alive, conversations flow, and stories connect us all. Here’s what you can do with our app:

📚 Discover New Books
Browse through a vast collection of books fetched from the Open Library API. Whether you're into thrillers, classics, or contemporary reads, you can easily find your next book to read, add it to your bookshelf, and get inspired by recommendations tailored to your preferences.

🧑‍🤝‍🧑 Join a Virtual Book Club
Join discussions with fellow book lovers who are reading the same book as you. Share your thoughts, opinions, and even heated debates in a fun, engaging way. Whether it’s a group of friends or a community of strangers, the conversations will always be exciting and insightful.

📖 Create Your Own Bookshelf
Curate your personal bookshelf, track your reading progress, and organize your books into categories like "Reading," "Completed," and "Wishlist." Keep all your favorite books in one place, and revisit them whenever you want to get nostalgic.

💬 Leave Reviews & Ratings
Read the opinions of others or share your own thoughts by leaving reviews and ratings on books you’ve finished. Whether it’s a heartfelt review or a quick 5-star rating, your feedback will help others make their next reading choice.

✨ Real-Time Discussions
Engage in live, real-time conversations with your fellow readers. Whether it’s for a group discussion or a one-on-one chat, the app keeps your conversations flowing smoothly. So, grab your coffee and chat about your favorite chapters!

🌙 Personalized Experience
Customize your reading experience with a soothing, lofi-inspired interface. Choose from a variety of calming themes—whether you’re in the mood for soft blues, warm coffee hues, or cozy sunset tones. Switch between light and dark modes for the perfect vibe, day or night.

🏆 Track Your Reading Journey
Monitor your reading progress and celebrate milestones. You can even create reading goals to stay motivated and track how many pages you’ve read each month. Let’s turn your reading habit into a rewarding experience!

🛋️ Cozy & Intuitive Design
The app is designed to make you feel like you’re sitting in your favorite reading nook. With its intuitive interface and cozy design, navigating through your bookshelf, discussions, and books has never felt more comfortable.

Ready to Start Your Reading Journey?
Join our book club, discover new reads, and connect with a community of passionate book lovers. Your next adventure starts with just one click—so what are you waiting for? Grab a cup of tea, relax, and start exploring!
*/
