import React, { useContext } from "react";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { MyContext } from "../../MyContext";  

function BookshelvesCard({ shelf, book }) {
    const { handleAddToLibrary, createBookError } = useContext(MyContext); 
    const { volumeInfo } = book;
    const { title, authors, description, imageLinks, categories, pageCount, publishedDate } = volumeInfo;
    
    const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

    const getBookshelfCoverImage = (shelf) => {
        if (shelf.books && shelf.books.length > 0) {
            const firstBook = shelf.books[0];
            return firstBook.cover_image || defaultbookimage; 
        } else {
            return defaultbookimage;
        }
    };

    
    const onAddToLibrary = (e) => {
        e.preventDefault(); 
        handleAddToLibrary(title, authors, description, coverImageUrl, publishedDate, shelf); 
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

                {/* Add to Library Button */}
                <div className="card-actions mt-3">
                    <button
                        onClick={onAddToLibrary}
                        className="btn btn-primary btn-xs w-full text-sm mt-2"
                    >
                        Add to Shelf
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookshelvesCard;
