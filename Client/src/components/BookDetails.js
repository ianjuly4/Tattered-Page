import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { MyContext } from "../MyContext";
import defaultbookimage from "../assets/defaultbookimage.jpg";
import { NavLink } from "react-router-dom";

function BookDetails() {
    const { bookKey } = useParams();
    const { books } = useContext(MyContext);

    
    const bookId = bookKey.replace('/works/', '');
    const book = books.find((book) => book.id === bookId);  

    console.log(book);

    if (!book) {
        return <div>Book not found.</div>;
    }

    const { volumeInfo } = book;
    const { title, authors, description, imageLinks } = volumeInfo;

    
    const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

    return (
        <div>
            {/* Sticky Header */}
            <div className="sticky top-0 z-10">
                <Header />
            </div>

            {/* Book Details Section */}
            <div className="p-4">
                <div className="card card-side bg-primary shadow-xl p-6">
                    <div className="card-body justify-center">
                        <h2 className="card-title mb-6  justify-center text-center">{title}</h2>
                        
                        {/* Image Section */}
                        <figure className="relative flex justify-center mb-6">
                        <img
                                src={coverImageUrl}
                                alt={title}
                                className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg"
                            />
                        </figure>

                        {/* Description Section */}
                        <p className="text-center mb-4">
                            {description ? description : "No description available."}
                        </p>

                        {/* Author and Action Section */}
                        {authors && authors.length > 0 && (
                            <p className="text-center mb-4">By {authors.join(", ")}</p>
                        )}
                        
                        <div className="card-actions flex justify-center border-2 border-gray-300 p-4 rounded-lg">
                            <NavLink to={"/bookshelves"}>
                                <button className="btn btn-primary ml-4">View Your Bookshelves</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
