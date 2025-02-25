import React from "react";

function UserBookCard({ book }) {
    const { author, cover_image, title } = book;
    const authors = typeof author === 'string' ? author.split(',').map(a => a.trim()) : [];
  
    console.log(book.id)
    return (
      <div className="card bg-primary w-44 overflow-hidden rounded-lg shadow-lg p-1">
        <figure className="flex justify-center items-center p-0 m-0"> 
          <img
            src={cover_image}
            alt={title}
            className="max-w-full max-h-86 object-cover rounded-lg"
          />
        </figure>
        <div className="card-body p-2"> 
          <h2 className="book-title text-lg font-semibold mt-1"> 

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
