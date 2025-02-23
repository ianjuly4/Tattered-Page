import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import BookshelvesCard from "../Bookshelves/BookshelvesCard";
import Footer from "../Footer";
import library from "../../assets/library.jpg"; // Add the image here

function BookDetails() {
  const { bookId } = useParams();
  const { books, user, isLoggedIn, createBook, error, setError } = useContext(MyContext);
  const { bookshelves } = user || {};

  const location = useLocation();
  const navigate = useNavigate();

  const book = books.find((book) => book.id === bookId);

  useEffect(() => {
    setError(null);
  }, [location]);

  useEffect(() => {
    if (user && user.books && bookId) {
      const userBook = user.books.find((book) => book.google_key === bookId);
      if (userBook) {
        navigate(`/users/${user.id}/books/${userBook.id}`);
      }
    }
  }, [user, bookId, navigate]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const { volumeInfo } = book || {};
  const { title, authors, description, imageLinks, categories, pageCount, publishedDate } = volumeInfo || {};

  const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

  const handleAddtoLibrary = () => {
    createBook(title, authors, description, coverImageUrl, publishedDate, bookId);
  };

  // Background Style
  const backgroundStyle = {
    backgroundImage: `url(${library})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div className="relative min-h-screen">
    
      <div style={backgroundStyle}></div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10">
        <Header />
      </div>

      <div className="p-4 relative z-10">
        <div className="card shadow-xl p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>

          <figure className="flex justify-center mb-6">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg"
            />
          </figure>

          <div className="text-center mb-4">
            <div
              className="max-h-48 overflow-y-auto px-4 mx-auto"
              style={{
                maxHeight: "12rem",
                minHeight: "6rem",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              <p className="text-sm">{description || "No description available."}</p>
            </div>
          </div>

          {authors && authors.length > 0 && (
            <p className="text-center mb-4 text-lg">By {authors.join(", ")}</p>
          )}

          {publishedDate && (
            <p className="text-center mb-4 text-lg">Published Date: {publishedDate}</p>
          )}

          {isLoggedIn && (
            <div className="flex items-center justify-center">
              <div className="flex space-x-4">
                <NavLink to={`/users/${user.id}/bookshelves`}>
                  <button className="btn btn-primary btn-sm">Go To Your Bookshelves</button>
                </NavLink>
                <button
                  onClick={handleAddtoLibrary}
                  className="btn btn-primary btn-sm"
                >
                  Add to Your Library
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-white text-right text-sm mb-4">{error}</div>}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookDetails;
