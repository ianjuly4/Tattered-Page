import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MyContext } from "../../MyContext";
import Header from "../Header";
import BookclubBookCarousel from "./BookclubBookCarousel";
import BookclubChat from "../Bookclubs/BookclubChat"; 
import BookclubMembers from "./BookclubMembers";
import Footer from "../Footer";

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

  

  return (
    <div className="bg-secondary">
      {/* Background Image */}
     

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
            <BookclubBookCarousel user={user} bookclub={bookclub} bookclubId={bookclub.id} />
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

     <Footer/>
    </div>
  );
}

export default BookclubDetails;
