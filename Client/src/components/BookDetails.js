import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { MyContext } from "../MyContext";
import defaultbookimage from "../assets/defaultbookimage.jpg";

function BookDetails() {
  const { bookKey } = useParams();
  const { books } = useContext(MyContext);

  const bookId = bookKey.replace('/works/', '');
  const book = books.find((book) => book.key === `/works/${bookId}`);

  if (!book) {
    return <div>Book not found.</div>;
  }

  const coverImageUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : defaultbookimage;

  return (
    <div>
      <Header />
      <div className="card card-side bg-primary shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-6">{book.title}</h2>
          <figure className="relative">
            <img
              src={coverImageUrl}
              alt={book.title}
              className="w-32 sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg mb-6"
            />
          </figure>
         
          <div className="card-actions  border-2 border-gray-300">
            <p>Click the button to watch on Jetflix app.</p>
            <button className="btn  btn-primary">Watch</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
