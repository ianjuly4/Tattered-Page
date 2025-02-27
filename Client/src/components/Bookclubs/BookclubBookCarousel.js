import React, {useContext} from "react";
import UserBookCard from "../Books/UserBookCard";
import { NavLink } from "react-router-dom";
import { MyContext } from "../../MyContext";

function BookclubBookCarousel({ user, bookclub }) {
    const { removeBookFromBookclub} = useContext(MyContext)
    const { books } = bookclub || {}; 

  
    const handleRemoveBook = (bookId) => {
        console.log(bookId, bookclub.id)
        removeBookFromBookclub(bookclub.id, bookId);  
      };

    return (
        <div className="py-8 p-8 container  border rounded-lg shadow-lg">
            <div className="max-h-60 overflow-y-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    {books && books.length > 0 ? (
                        books.map((book) => (
                            <div key={book.id} className="p-2">
                                <NavLink to={`/users/${user.id}/books/${book.id}`} >
                                    <UserBookCard book={book} />
                                </NavLink>
                                <button onClick={()=>handleRemoveBook(book.id)}className="border justifty-center rounded bg-primary"> Remove Book</button> 
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 p-8">
                            
                            <p className="text-xl font-semibold text-left mb-4">
                                No books have been added yet. Please add some books to this Bookclub! Click here to go to Bookshelves
                            </p>
                            <NavLink to={`/users/:userId/bookshelves`}>
                                <button className="justify-center btn-black bg-secondary border rounded"> Go to Bookshelves</button>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookclubBookCarousel;
