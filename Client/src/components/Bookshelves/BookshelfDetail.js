import React, { useContext } from "react";
import Header from "../Header";
import library from "../../assets/library.jpg";
import { MyContext } from "../../MyContext";
import UserBookCard from "../Books/UserBookCard";
import { useParams, NavLink } from "react-router-dom";
import Footer from "../Footer";

function BookshelfDetail() {
    const { shelfId } = useParams();
    const { user, removeBookFromBookshelf } = useContext(MyContext);
    const { bookshelves } = user || {};

    const bookshelf = bookshelves ? bookshelves.find(shelf => shelf.id === parseInt(shelfId)) : null;

    if (!bookshelf) {
        return (
            <div>
                <Header />
                <div>Bookshelf not found.</div>
                <Footer />
            </div>
        );
    }

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

    const handleRemoveBook = (bookshelfId, bookId) => {
        removeBookFromBookshelf(bookshelfId, bookId);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header /> {/* Header Component */}
            
            <div style={backgroundStyle}></div> 

            <div style={{ flex: 1, position: "relative", zIndex: 1, color: "white", padding: "50px 20px" }}>
                {/* Bookshelf Details */}
                <h1 className="text-4xl font-bold mb-4">{bookshelf.name}</h1>
                <p className="text-lg mb-4">{bookshelf.description}</p>
                <p className="text-md mb-8"><strong>Genre:</strong> {bookshelf.genre}</p>

                {/* Carousel with UserBookCard */}
                <div className="carousel w-full max-w-4xl mx-auto space-x-4">
                    {bookshelf.books && bookshelf.books.length > 0 ? (
                        bookshelf.books.map((book) => (
                            <div
                                key={book.id}
                                className="carousel-item w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                            >
                                {/* Card Content */}
                                <div
                                    className="flex flex-col justify-between"
                                    style={{ height: "350px", width: "100%" }} 
                                >
                                    <UserBookCard book={book} /> 

                                    {/* Remove Book Button */}
                                    <button
                                        onClick={() => handleRemoveBook(bookshelf.id, book.id)}
                                        className="btn btn-primary btn-sm mt-2 w-full" 
                                    >
                                        Remove Book
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No books in this bookshelf.</p>
                            {/* Go Back Button */}
                            <NavLink to="/bookshelves" className="btn btn-primary btn-sm mt-4">
                                Go Back to Bookshelves
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer /> 
        </div>
    );
}

export default BookshelfDetail;
