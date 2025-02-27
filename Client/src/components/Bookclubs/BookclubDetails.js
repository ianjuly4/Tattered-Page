import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MyContext } from "../../MyContext";
import Header from "../Header";
import BookclubBookCarousel from "./BookclubBookCarousel";
import Footer from "../Footer";
import animecoffeeshop from "../../assets/animecoffeeshop.jpg"

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
        backgroundRepeat: "no-repeat",
        minHeight: "140vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      };

  return (
    <div >
      {/* Header */}
      <Header />
      <div style={backgroundStyle}></div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="p-8 z-10 relative">
          <h1 className="text-4xl font-bold text-center text-black mb-4">{bookclub.name}</h1>
          <p className="text-lg font-semibold text-black text-center mb-6">
            {bookclub.description || "No description available."}
          </p>

          {/* Bookclub Book Carousel */}
          <div className="mt-8">
            <BookclubBookCarousel user={user} bookclub={bookclub} bookclubId={bookclub.id} />
          </div>

         
        </div>
      </div>
      <div>
      <Footer/>
     </div>
    </div>
  );
}

export default BookclubDetails;
