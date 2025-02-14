import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import BookCard from "./BookCard";
import { NavLink } from "react-router-dom";

function SearchResults() {
  const { books, loading, error } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    // When the books data or loading status changes, set isLoading accordingly
    if (!loading && books) {
      setIsLoading(false); // Set loading to false when books are fetched
    }
  }, [loading, books]); // Dependency array ensures that it runs when loading or books change

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="hero bg-secondary min-h-screen flex justify-center items-center">
          <div>Loading...</div> {/* You can replace this with a spinner or any loading UI */}
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
        <div className="bg-secondary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading && <p>Loading...</p>} {/* Show loading message if still loading */}
          {error && <p>{error}</p>} {/* Show error if there is one */}
          
          {/* Display books when loaded */}
          {books && books.length > 0 ? (
            books.map((book) => (
              <NavLink
                key={book.id}
                to={`/books/${book.id}`}
                className="block"
              >
                <div className="p-4">
                  <BookCard book={book} />
                </div>
              </NavLink>
            ))
          ) : (
            <div className="col-span-3 text-center">
              <p>No books found. Please try a different search.</p>
            </div>
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
