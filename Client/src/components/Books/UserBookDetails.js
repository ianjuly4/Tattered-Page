import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import BookshelvesCard from "../Bookshelves/BookshelvesCard";
import Footer from "../Footer";
import library from "../../assets/library.jpg";
import UsersBookclubCard from "../Bookclubs/UsersBookclubCard";

function UserBookDetails() {
  const { bookId } = useParams();
  const { user, isLoggedIn, setError, updateBookProgress, error } = useContext(MyContext);
  const { bookshelves, books, bookclubs } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const [bookProgress, setBookProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/bookshelves");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError(null);
  }, [location]);

  // Set initial progress on book load
  useEffect(() => {
    if (user && books) {
      const book = books.find((book) => book.id === Number(bookId));
      if (book) {
        setBookProgress(book.progress || 0);
      }
    }
  }, [books, bookId, user]);

  // If loading or no books are available, show loading message
  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (!books || !Array.isArray(books)) {
    return <div>Books not available.</div>;
  }

  const book = books.find((book) => book.id === Number(bookId));

  if (!book) {
    return <div>Book not found</div>;
  }

  const { title, author, synopsis, cover_image, published_date } = book;

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

  const handleProgressChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 100) {
      setBookProgress(value);
    }
  };

  // Update the progress in the context and trigger a re-render
  const handleProgressUpdate = () => {
    updateBookProgress(bookId, bookProgress)
      .then((updatedBook) => {
        // Book progress is updated in context, no need to set the state manually
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div style={backgroundStyle}></div>
      {/* Overlay to darken background for readability */}
      <div className="absolute inset-0 opacity-50"></div>

      <div className="relative z-10 flex-grow">
        {/* Header */}
        <Header />
      </div>

      <div className="p-4 relative z-10 flex-grow">
        <div className="card shadow-xl p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>

          <figure className="flex justify-center mb-6">
            <img
              src={cover_image || defaultbookimage}
              alt={title}
              className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded-lg shadow-lg border-4 border-black"
            />
          </figure>

          <div className="text-center mb-4">
            <div
              className="max-h-48 overflow-y-auto px-4 mx-auto"
              style={{
                maxHeight: "20rem",
                minHeight: "6rem",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              <p className="text-sm">{synopsis || "No description available."}</p>
            </div>
          </div>

          <p className="text-center mb-4 text-lg">By {author || "Unknown Author"}</p>

          {published_date && (
            <p className="text-center mb-4 text-lg">Published Date: {published_date}</p>
          )}

          <div className="mt-4 text-center flex flex-col items-center space-y-4">
            {/* Progress Bar */}
            <div className="w-48 bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${bookProgress}%`,
                  backgroundColor: bookProgress === 100 ? "grey" : "blue",
                }}
              ></div>
            </div>

            {/* Input and Button for updating progress */}
            <div className="flex items-center space-x-4">
              <input
                type="number"
                id="progress"
                min="0"
                max="100"
                value={bookProgress}
                onChange={handleProgressChange}
                className="w-20 p-2 text-center border border-gray-300 rounded-md"
              />
              <button onClick={handleProgressUpdate} className="btn btn-primary btn-sm">
                Update Book Progress
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Bookshelves Section with Border */}
          <div className="border-4 mt-6 border-gray-300 p-4 mb-6 rounded-lg">
            {isLoggedIn ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-center">Your Bookshelves</h2>
                  <NavLink to={`/users/${user.id}/bookshelves`}>
                    <button className="btn btn-primary btn-sm">Go To Your Bookshelves</button>
                  </NavLink>
                </div>

                <div className="flex overflow-x-auto space-x-4">
                  {bookshelves && bookshelves.length > 0 ? (
                    bookshelves.map((shelf) => (
                      <div className="w-60 p-4 flex-none" key={shelf.id}>
                        <BookshelvesCard shelf={shelf} bookId={book.id} user={user} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Bookshelves Found, Please Go To Bookshelves To Create A Bookshelf.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>You need to be logged in to view your bookshelves.</p>
              </div>
            )}
          </div>

          {/* Bookclubs Section with Border */}
          <div className="border-4 border-gray-300 p-4 rounded-lg">
            {isLoggedIn ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-center">Your Book Clubs</h2>
                  <NavLink to={`/users/${user.id}/bookclubs`}>
                    <button className="btn btn-primary btn-sm">Go To Your Book Clubs</button>
                  </NavLink>
                </div>

                <div className="flex overflow-x-auto space-x-4">
                  {bookclubs && bookclubs.length > 0 ? (
                    bookclubs.map((club) => (
                      <div className="w-60 p-4 flex-none" key={club.id}>
                        <UsersBookclubCard club={club} user={user} book={book} bookId={book.id} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Book Clubs Found, Please Join A Book Club to See Your Book Clubs.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>You need to be logged in to view your book clubs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
}

export default UserBookDetails;
