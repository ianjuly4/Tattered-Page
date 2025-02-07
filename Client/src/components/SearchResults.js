import React, { useContext } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import BookCard from "./BookCard";
import { NavLink } from "react-router-dom";

function SearchResults() {
  const { books } = useContext(MyContext);

  console.log(books);
  return (
    <div>
      <Header />
      <div className="w-full px-0 py-4">
        <div className="bg-primary grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books && books.length > 0 ? (
            books.map((book) => (
                <NavLink 
                key={book.key} 
                to={`/books/${book.key.replace('/works/', '')}`} 
                className="block"
              >
                <div className="p-4">
                  <BookCard book={book} />
                </div>
              </NavLink>
              
            ))
          ) : (
            <p>No books found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
