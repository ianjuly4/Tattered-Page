import React from "react";
import defaultbookimage from "../../assets/defaultbookimage.jpg";


function BookCard({ book }) {
  const { volumeInfo } = book;
  const { title, authors, description, imageLinks } = volumeInfo;

  
  const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure className="flex justify-center items-center p-6">
        <img
          src={coverImageUrl}
          alt={title}
          className="max-w-full max-h-96 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="book-title text-lg font-semibold">
          {title}
        </h2>
        <p className="text-sm">
          {authors && authors.length > 0
            ? `By ${authors.join(", ")}`
            : "Author unknown"}
        </p>
        <p className="text-sm">
          {description ? description.substring(0, 100) + "..." : "No description available."}
        </p>
        <div className="card-actions justify-end">
          {/* Optional actions like "Add to Wishlist" can go here */}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
