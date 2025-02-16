import React, { useContext } from "react";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";

function BookshelvesCard({ shelf }) {
  // Function to determine the bookshelf cover image
  const getBookshelfCoverImage = (shelf) => {
    if (shelf.books && shelf.books.length > 0) {
      // Use the first book's cover image if books exist
      const firstBook = shelf.books[0];
      return firstBook.imageLinks?.thumbnail || defaultbookimage;
    } else {
      // Return default image if there are no books
      return defaultbookimage;
    }
  };

  return (
    <div className="card bg-base-100 w-64 shadow-xl">
      <figure className="flex justify-center items-center p-4">
        <img
          src={getBookshelfCoverImage(shelf)} // Dynamically get the cover image
          alt={shelf.name}
          className="max-w-full max-h-48 object-contain"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="book-title text-md font-semibold">{shelf.name}</h2>
        <p className="text-sm">
          {shelf.books && shelf.books.length > 0
            ? `Contains ${shelf.books.length} books`
            : "No books in this shelf"}
        </p>
        <p className="text-sm">
          {shelf.description
            ? shelf.description.substring(0, 70) + "..." // Shorten description
            : "No description available."}
        </p>
      </div>
    </div>
  );
}

export default BookshelvesCard;
