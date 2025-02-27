import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../MyContext";
import Header from "../Header";
import BookCard from "./BookCard";
import { NavLink, useLocation } from "react-router-dom";
import Footer from "../Footer";
import library from "../../assets/library.jpg";

function SearchResults() {
  const { books, loading, error, setError } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (!loading && books) {
      setIsLoading(false);
    }
  }, [loading, books, location]);

  useEffect(() => {
    setError(null); 
  }, [location]);

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
  console.log(books)
  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="hero bg-secondary min-h-screen flex justify-center items-center">
          <div style={backgroundStyle}></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header />
      
      {/* Background */}
      <div style={backgroundStyle}></div>

      <div className="hero  min-h-screen flex justify-center items-center text-left relative z-20 pt-20">
        <div className="hero-content flex-col lg:flex-row w-full">
          <div className="text-left lg:text-left">
            {/* Conditional rendering for the landing page welcome message */}
            { books && !error && (
              <div className="py-8 text-center">
                <h2 className="text-2xl font-semibold">Welcome, please use the search bar to find books.</h2>
                <p className="mt-4">Start exploring our collection of books by searching for titles, authors, or genres.</p>
              </div>
            )}

            {/* Render books if available */}
            {books && books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {books.map((book) => (
                  <NavLink key={book.id} to={`/books/${book.id}`} className="block">
                    <div className="p-4">
                      <BookCard book={book} />
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              books && error && (
                <div className="col-span-3 text-center py-8">
                  <h3 className="text-xl">{error}</h3>
                  <p>Please try a different search or explore other categories.</p>
                </div>
              )
            )}

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default SearchResults;
