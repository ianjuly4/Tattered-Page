import React, { useContext } from "react";
import Header from "../Header";
import library from "../../assets/library.jpg";
import { MyContext } from "../../MyContext";
import UserBookCard from "../Books/UserBookCard";  

function BookshelfDetail() {
  const { user } = useContext(MyContext);
  const { bookshelves } = user || {};
  const bookshelf = bookshelves && bookshelves[0]; 

  const backgroundStyle = {
    backgroundImage: `url(${library})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div style={{ position: "relative" }}>
      <div>
        <Header />
      </div>

      {/* Background */}
      <div style={backgroundStyle}></div>

      {/* Bookshelf Details */}
      <div style={{ position: "relative", zIndex: 1, color: "white", padding: "50px 20px" }}>
        <h1 className="text-4xl font-bold mb-4">{bookshelf?.name}</h1>
        <p className="text-lg mb-4">{bookshelf?.description}</p>
        <p className="text-md mb-8"><strong>Genre:</strong> {bookshelf?.genre}</p>

        {/* DaisyUI Carousel with UserBookCard */}
        <div className="carousel w-full max-w-4xl mx-auto space-x-4">
          {bookshelf?.books?.map((book) => (
            <div key={book.id} className="carousel-item w-full">
              <UserBookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookshelfDetail;
