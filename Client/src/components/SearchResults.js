import React, { useContext, useState } from "react";
import { MyContext } from "../MyContext";
import Header from "./Header";
import BookCard from "./BookCard";

function SearchResults() {
  const { books } = useContext(MyContext);
  const [results, setResults] = useState("");

  console.log(books)
  return (
    <div>
      <Header  />
      <div className=" container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
          {/* Loop through your books and render each BookCard */}
          {books && books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className="p-2">
                <BookCard book={book} />
              </div>
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
