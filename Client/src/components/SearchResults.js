import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import BookCard from "./BookCard";
import { NavLink, useLocation } from "react-router-dom";

function SearchResults() {
  const { books, loading, error } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fromLanding, setFromLanding] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const location = useLocation();
  const from = location.state?.from || "/";  

  console.log(from);

  useEffect(() => {
    if (!loading && books) {
      setIsLoading(false);
    }
  }, [loading, books]);

  useEffect(() => {
    if (from === '/') {
      setFromLanding(true);
      setShowWelcomeMessage(true);  
    } else {
      setFromLanding(false);
      setShowWelcomeMessage(false); 
    }
  }, [from]);

  const noBooksFound = !loading && books && books.length === 0;

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="hero bg-secondary min-h-screen flex justify-center items-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="w-full px-4 py-6">
        <div className="bg-secondary">
          
          {/* Conditional rendering for the landing page welcome message */}
          {showWelcomeMessage && (
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
            // Show "No books found" message if no books are found and not from landing
            !showWelcomeMessage && noBooksFound && (
              <div className="col-span-3 text-center py-8">
                <h3 className="text-xl">No books found.</h3>
                <p>Please try a different search or explore other categories.</p>
              </div>
            )
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default SearchResults;
