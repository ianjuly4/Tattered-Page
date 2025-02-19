import React, { useContext, useState } from "react";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { MyContext } from "../../MyContext";

function BookshelvesCard({ shelf, book, bookId }) {
    const { updateBookshelf } = useContext(MyContext);
    
    const getBookshelfCoverImage = (shelf) => {
        if (shelf.books && shelf.books.length > 0) {
            const firstBook = shelf.books[0];
            return firstBook.cover_image || defaultbookimage;
        } else {
            return defaultbookimage;
        }
    };
  

    // Initially check if the book is already in the shelf
    const isBookInShelf = shelf.books.some((shelfBook) => shelfBook.id === bookId);
   
    const onAddToLibrary = () => {
        if (!isBookInShelf) {
            updateBookshelf(shelf.id, bookId); 
        }
    };

    return (
        <div className="card bg-base-100 w-38 shadow-md p-2">
            <figure className="flex justify-center items-center p-2">
                <img
                    src={getBookshelfCoverImage(shelf)}
                    alt={shelf.name}
                    className="max-w-full max-h-09 object-contain"
                />
            </figure>
            <div className="card-body p-2">
                <h2 className="book-title text-sm font-semibold">{shelf.name}</h2>
                <p className="text-xs">
                    {shelf.books && shelf.books.length > 0
                        ? `Contains ${shelf.books.length} books`
                        : "No books in this shelf"}
                </p>
                <p className="text-xs">
                    {shelf.description
                        ? shelf.description.substring(0, 50) + "..."
                        : "No description available."}
                </p>

                {/* Conditionally render button */}
                <div className="card-actions mt-3">
                    {isBookInShelf ? (
                        <button
                            disabled
                            className="btn btn-secondary btn-xs w-full text-sm mt-2"
                        >
                            On Shelf
                        </button>
                    ) : (
                        <button
                            onClick={onAddToLibrary}
                            className="btn btn-primary btn-xs w-full text-sm mt-2"
                        >
                            Add to Shelf
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookshelvesCard;
