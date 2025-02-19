import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import BookshelvesCard from "../Bookshelves/BookshelvesCard";

function UserBookDetails() {
  const { bookId } = useParams();
  const { user, isLoggedIn, setError } = useContext(MyContext);
  const { bookshelves, books } = user || {};  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

 
  useEffect(() => {
    if (!user) {
      setIsLoading(true); 
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/bookshelves"); 
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError(null); 
  }, [location]);

  if (isLoading) {
    return <div>Loading....</div>; 
  }

  if (!books || !Array.isArray(books)) {
    return <div>Books not available.</div>;
  }

  const book = books.find((book) => book.id === Number(bookId));
  console.log(book)

  if (!book) {
    return <div>Book not found</div>;
  }

  const { title, author, synopsis, cover_image, published_date } = book;

  return (
    <div>
      <div className="top-0 z-10">
        <Header />
      </div>

      <div className="p-4">
        <div className="card bg-secondary shadow-xl p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>

          <figure className="flex justify-center mb-6">
            <img
              src={cover_image || defaultbookimage}
              alt={title}
              className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg border-4 border-gray-300"
            />
          </figure>

          <div className="text-center mb-4">
            <div
              className="max-h-48 overflow-y-auto px-4 mx-auto"
              style={{
                maxHeight: "20rem",
                minHeight: "6rem",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              <p className="text-sm">{synopsis || "No description available."}</p>
            </div>
          </div>

          <p className="text-center mb-4 text-lg">By {author || "Unknown Author"}</p>

          {published_date && (
            <p className="text-center mb-4 text-lg">Published Date: {published_date}</p>
          )}

          {isLoggedIn && (
            <div className="flex justify-between items-center">
              <h1 className="text-3xl flex text-right font-bold">Your Bookshelves</h1>
              <div className="flex space-x-4">
                <NavLink to={`/users/${user.id}/bookshelves`}>
                  <button className="btn btn-primary btn-sm">Go To Your Bookshelves</button>
                </NavLink>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 border border-black rounded-lg shadow-lg">
            {isLoggedIn ? (
              <>
                <div className="flex overflow-x-auto space-x-4">
                  {bookshelves && bookshelves.length > 0 ? (
                    bookshelves.map((shelf) => (
                      <div className="w-60 p-4 flex-none" key={shelf.id}>
                        <BookshelvesCard shelf={shelf} bookId={book.id} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Bookshelves Found, Please Go To Bookshelves To Create A Bookshelf.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>You need to be logged in to view your bookshelves and bookclubs.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default UserBookDetails;
