import React, { useContext } from "react";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { MyContext } from "../../MyContext";
import { useNavigate } from "react-router-dom";

function UsersBookclubCard({ club = {}, user, book, bookId }) {
    const { addBookToBookclub } = useContext(MyContext);

    const navigate = useNavigate()

  
    const getBookshelfCoverImage = (shelf) => {
        if (shelf.books && shelf.books.length > 0) {
        const firstBook = shelf.books[0];
        return firstBook.cover_image || defaultbookimage;
        } else {
        return defaultbookimage;
        }
    };

    const isBookInClub = Array.isArray(club.books) && club.books.some((clubBook) => clubBook.id === bookId);
    
    const onAddToClub = (clubId, bookId) => {
        if (!isBookInClub) {
            addBookToBookclub(clubId, bookId); 
        }
    };


   
    return (
        <div className="card bg-base-100 w-38 shadow-md p-2">
        <figure className="flex justify-center items-center p-2">
            <img
            src={getBookshelfCoverImage(club)}
            alt={club.name}
            className="max-w-full max-h-09 object-contain"
            />
        </figure>
        <div className="card-body p-2">
            <h2 className="book-title text-sm font-semibold">{club.name}</h2>
            <p className="text-xs">
            {Array.isArray(club.books) && club.books.length > 0
                ? `Contains ${club.books.length} books`
                : "No books in this club"}
            </p>
            <p className="text-xs">
            {club.description
                ? club.description.substring(0, 50) + "..."
                : "No description available."}
            </p>

            {/* Conditionally render button */}
            <div className="card-actions mt-3">
                <button onClick={()=> navigate(`/users/${user.id}/bookclubs/${club.id}`)} className="btn btn-primary btn-xs w-full text-sm mt-2">Go To Club</button>
            {isBookInClub ? (
                <button
                disabled
                className="btn btn-primary btn-xs w-full text-sm mt-2"
                >
                In Club
                </button>
            ) : (
                <button onClick={()=>onAddToClub(club.id, bookId)}className="btn btn-primary btn-xs w-full text-sm mt-2">
                Add To Club
                </button>
            )}
            </div>
        </div>
        </div>
    );
}

export default UsersBookclubCard;
