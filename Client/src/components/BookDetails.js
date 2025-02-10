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

    if (!book) {
        return <div>Book not found.</div>;
    }

    const { volumeInfo } = book;
    const { title, authors, description, imageLinks, categories, pageCount, publishedDate } = volumeInfo;

    const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

    return (
        <div>
            {/* Sticky Header */}
            <div className="sticky top-0 z-10">
                <Header />
            </div>

            {/* Book Details Section */}
            <div className="p-4">
                <div className="card bg-primary shadow-xl p-6 rounded-lg">

                    {/* Book Title */}
                    <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>

                    {/* Image Section */}
                    <figure className="flex justify-center mb-6">
                        <img
                            src={coverImageUrl}
                            alt={title}
                            className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg"
                        />
                    </figure>

                    {/* Description Section */}
                    <div className="text-center mb-4">
                        <p>{description || "No description available."}</p>
                    </div>

                    {/* Author Section */}
                    {authors && authors.length > 0 && (
                        <p className="text-center mb-4 text-lg">By {authors.join(", ")}</p>
                    )}

                    {/* Category Section */}
                    {categories && (
                        <p className="text-center mb-4 text-lg">Categories: {categories.join(", ")}</p>
                    )}

                    {/* Page Count Section */}
                    {pageCount && (
                        <p className="text-center mb-4 text-lg">Page Count: {pageCount}</p>
                    )}

                    {/* Published Date Section */}
                    {publishedDate && (
                        <p className="text-center mb-4 text-lg">Published Date: {publishedDate}</p>
                    )}

                    {/* Action Section with Buttons next to each other */}
                    <div className="flex justify-center gap-4 mt-4">
                        <NavLink to={"/bookshelves"}>
                            <button className="btn btn-primary">View Your Bookshelves</button>
                        </NavLink>

                        {/* Add to Bookshelf Button */}
                        <button className="btn btn-primary">Add Book To Bookshelf</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default BookDetails;
