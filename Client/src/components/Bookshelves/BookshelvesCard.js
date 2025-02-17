import React, { useState } from "react";
import defaultbookimage from "../../assets/defaultbookimage.jpg";

function BookshelvesCard({ shelf, book }) {
    const [updatedShelf, setUpdatedShelf] = useState(shelf);  
    const { volumeInfo } = book;
    const { title, authors, description, imageLinks, categories, pageCount, publishedDate } = volumeInfo;
    
    const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;
    
    console.log(volumeInfo);

    // Adjusted getBookshelfCoverImage to work with updatedShelf
    const getBookshelfCoverImage = (shelf) => {
        if (shelf.books && shelf.books.length > 0) {
            const firstBook = shelf.books[0];
            return firstBook.cover_image || defaultbookimage; // Use cover_image from the book data
        } else {
            return defaultbookimage;
        }
    };

    const handleAddToLibrary = async (event) => {
        event.preventDefault();
      
        const bookData = {
          title: title,
          author: authors,
          synopsis: description,
          cover_image: coverImageUrl,
          progress: 0,
          published_date: publishedDate
        };
      
        try {
            // Create the new book
            const createBookResponse = await fetch("/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookData),
            });
        
            const createBookResult = await createBookResponse.json();
        
            if (!createBookResponse.ok) {
                throw new Error(createBookResult.message || "Error creating book");
            }
        
            const bookId = createBookResult.id;
        
            // Add the book to the bookshelf
            const addBookToBookshelfResponse = await fetch(`/bookshelves/${shelf.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    book_id: bookId 
                }),
            });
        
            const addBookToBookshelfResult = await addBookToBookshelfResponse.json();
        
            if (!addBookToBookshelfResponse.ok) {
                throw new Error(addBookToBookshelfResult.message || "Error adding book to shelf");
            }
        
            console.log(addBookToBookshelfResult.message);  

            const updatedBooks = [...updatedShelf.books, createBookResult]; 
            setUpdatedShelf({ ...updatedShelf, books: updatedBooks });  

        } catch (error) {
            console.error("Error:", error.message);  
        }
    };

    return (
        <div className="card bg-base-100 w-38 shadow-md p-2">
            <figure className="flex justify-center items-center p-2">
                <img
                    src={getBookshelfCoverImage(updatedShelf)}  
                    alt={updatedShelf.name}  
                    className="max-w-full max-h-09 object-contain"
                />
            </figure>
            <div className="card-body p-2">
                <h2 className="book-title text-sm font-semibold">{updatedShelf.name}</h2>  
                <p className="text-xs">
                    {updatedShelf.books && updatedShelf.books.length > 0
                        ? `Contains ${updatedShelf.books.length} books`
                        : "No books in this shelf"}
                </p>
                <p className="text-xs">
                    {updatedShelf.description
                        ? updatedShelf.description.substring(0, 50) + "..." 
                        : "No description available."}
                </p>

                {/* Add to Library Button */}
                <div className="card-actions mt-3">
                    <button
                        onClick={handleAddToLibrary}
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
