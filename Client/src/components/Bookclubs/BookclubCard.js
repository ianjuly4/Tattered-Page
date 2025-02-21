import React from "react";
import { NavLink } from "react-router-dom";


function BookclubCard({ club, user }) {

    return (
        <div className="card bg-secondary w-32 shadow-md p-2">
            <div className="card-body p-2">
                <h2 className="bookclub-title text-sm font-semibold">{club.name}</h2>
                <p className="text-xs">
                    {club.books && club.books.length > 0
                        ? `Contains ${club.books.length} books`
                        : "No books in this club"}
                </p>
                <p className="text-xs">
                    {club.description
                        ? club.description.length > 50
                            ? `${club.description.substring(0, 50)}...`
                            : club.description
                        : "No description available."}
                </p>

                <div className="card-actions mt-3">
                    <NavLink to={`/users/${user.id}/bookclubs/${club.id}`}>
                    <button className="btn btn-primary btn-xs w-full text-sm mt-2">View Club</button>
                    </NavLink>
                </div>

            </div>
        </div>
    );
}

export default BookclubCard;
