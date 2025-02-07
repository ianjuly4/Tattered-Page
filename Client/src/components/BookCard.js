import React from "react";
import defaultbookimage from "../assets/defaultbookimage.jpg"

function BookCard({ book }) {
  const { title, author_name, cover_i, subject } = book;

  const coverImageUrl = cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
    : defaultbookimage;

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <img
          src={coverImageUrl}
          alt={title} 
        />
      </figure>
      <div className="card-body">
        <h2 className="book-title text-lg font-semibold">
          {title}
        </h2>
        <p className="text-sm">
          {author_name && author_name.length > 0
            ? `By ${author_name.join(", ")}`
            : "Author unknown"}
        </p>
        {subject && subject.length > 0 && (
          <p className="text-sm">
            <strong>Subjects:</strong> {subject.join(", ")}
          </p>
        )}
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
