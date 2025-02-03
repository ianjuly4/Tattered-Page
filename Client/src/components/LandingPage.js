// src/components/LandingPage.js

import React from 'react';

const LandingPage = () => {
  return (
    <div data-theme="lofitheme" className="p-8 justify place-items-center">
      {/* Main container */}
      <h1 className="text-4xl font-bold text-primary">Welcome to the Tattered Page</h1>
      <p className="mt-4 text-lg text-center text-neutral">
      Get lost in the world of books—discover new titles, connect with fellow readers, and share your thoughts on what you’ve read. Whether you’re looking for recommendations or just want to chat about your latest read, this is the place for you
      </p>
      <div className=''>
      {/* DaisyUI Button */}
      <button className="btn btn-primary mt-6" >Get Started</button>
      </div>
      {/* Footer */}
      <footer className="mt-8">
        <p>Made with ❤️ for book lovers</p>
      </footer>
    </div>
  );
};

export default LandingPage;



/*Features of the Virtual Book Club App
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
