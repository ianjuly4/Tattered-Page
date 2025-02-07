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

    console.log(book)

    if (!book) {
        return <div>Book not found.</div>;
    }

    const coverImageUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : defaultbookimage;

    return (
        <div>
        {/* Sticky Header */}
        <div className="sticky top-0 z-10">
            <Header />
        </div>

        {/* Book Details Section */}
        <div className="p-4">
            <div className="card card-side bg-primary shadow-xl p-6">
            <div className="card-body justify center">
                <h2 className="card-title mb-6">{book.title}</h2>
                <figure className="relative flex justify-center mb-6">
                <img
                    src={coverImageUrl}
                    alt={book.title}
                    className="w-32 sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg"
                />
                </figure>
                <p className="text-center mb-4">{book.description || "No description available."}</p>
                <div className="card-actions flex justify-center border-2 border-gray-300 p-4 rounded-lg">
                <p>Click the button to watch on Jetflix app.</p>
                <button className="btn btn-primary ml-4">Watch</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default BookDetails;
