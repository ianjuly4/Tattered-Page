import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from "../../MyContext";


function BookclubCard({ club, user }) {
   const {deleteBookclub, status} = useContext(MyContext)

   
    const handleBookclubDelete = (clubId)=>{
        deleteBookclub(clubId)
    }

    const handleViewClub = (clubId, userId) => {
        localStorage.setItem("user_id", userId);
        localStorage.setItem("bookclub_id", clubId);

    }
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
                    <button onClick={()=>handleViewClub(club.id, user.id)} className="btn btn-primary btn-xs w-full text-sm mt-2">View Club</button>
                    </NavLink>
                    <button onClick={()=> handleBookclubDelete(club.id)} className='btn btn-primary btn-xs w-full text-sm mt-2'>Delete</button>
                </div>

            </div>
        </div>
    );
}

export default BookclubCard;
