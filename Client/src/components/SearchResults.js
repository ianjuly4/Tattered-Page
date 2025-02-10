import React, { useContext } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import BookCard from "./BookCard";
import { NavLink } from "react-router-dom";

function SearchResults() {
  const { books, loading, error } = useContext(MyContext);
  console.log(books)

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="w-full px-4 py-6">
        <div className="bg-secondary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {books && books.length > 0 ? (
            books.map((book) => (
              <NavLink
                key={book.id}  
                to={`/books/${book.id}`}  e
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
    </div>
  );
}

export default SearchResults;
