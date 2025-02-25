import React from "react";

function UserBookCard({ book }) {
    const { author, cover_image, title } = book;
    const authors = typeof author === 'string' ? author.split(',').map(a => a.trim()) : [];

    return (
      <div className="card bg-primary w-44 overflow-hidden rounded-lg shadow-lg p-1 flex flex-col h-full">
        <figure className="flex justify-center items-center p-0 m-0">
          <img
            src={cover_image}
            alt={title}
            className="object-cover w-full h-56"  
          />
        </figure>
        <div className="card-body p-2 flex-grow">
          <h2 className="book-title text-lg font-semibold mt-1 truncate">
            {title}
          </h2>
          <p className="text-sm mt-1">
            {authors.length > 0 ? `By ${authors.join(", ")}` : "Author unknown"}
          </p>
        </div>
      </div>
    );
}

export default UserBookCard;
