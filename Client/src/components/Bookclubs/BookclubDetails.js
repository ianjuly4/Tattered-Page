import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MyContext } from "../../MyContext";
import Header from "../Header";
import animecoffeeshop from "../../assets/animecoffeeshop.jpg";
import BookclubBookCarousel from "../Books/BookclubBookCarousel";
import BookclubChat from "../Bookclubs/BookclubChat"; 
import BookclubMembers from "./BookclubMembers";

function BookclubDetails() {
  const { user, isLoggedIn, setError } = useContext(MyContext);
  const { clubId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [bookclub, setBookclub] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/bookclubs");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError(null);
  }, [location]);

  useEffect(() => {
    if (user && user.bookclubs) {
      const foundBookclub = user.bookclubs.find((bookclub) => bookclub.id === Number(clubId));
      setBookclub(foundBookclub);
    }
  }, [user, clubId]);

  if (isLoading || !bookclub) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const backgroundStyle = {
    backgroundImage: `url(${animecoffeeshop})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "200vh",
    filter: "blur(6px)",
    opacity: 0.6,
    backgroundRepeat: "no-repeat",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div style={backgroundStyle}></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="p-8 z-10 relative">
          <h1 className="text-4xl font-bold text-center text-gray-300 mb-4">{bookclub.name}</h1>
          <p className="text-lg font-semibold text-gray-300 text-center mb-6">
            {bookclub.description || "No description available."}
          </p>

          {/* Bookclub Book Carousel */}
          <div className="mt-8">
            <BookclubBookCarousel user={user} bookclub={bookclub} />
          </div>

          {/* Chatbox and Members section - Side by Side with Equal Sizes */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Chatbox */}
            <div className="col-span-1 flex flex-col h-full">
              <div className="">
                <BookclubChat bookclub={bookclub} />
              </div>
            </div>
            
            {/* Invite Members */}
            <div className="col-span-1 flex flex-col h-full">
              <div className="">
                <BookclubMembers bookclub={bookclub} />
              </div>
            </div>
          </div>
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

export default BookclubDetails;
