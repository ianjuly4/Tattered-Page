import React from "react";

import UserBookCard from "./UserBookCard";

function BookclubBookCarousel({ user, bookclub }) {
    const { books } = bookclub || {}; 

    return (
        <div className="py-8 p-8 container border">
            <div className="max-h-60 overflow-y-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <div key={book.id} className="p-2"> 
                                <UserBookCard book={book} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 p-8">
                            <p className="text-xl font-semibold text-left mb-4">
                                No books have been added yet. Please add some books to this Bookclub!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookclubBookCarousel;
