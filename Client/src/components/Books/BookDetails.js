import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import BookshelvesCard from "../Bookshelves/BookshelvesCard";

function BookDetails() {
  const { bookId } = useParams();
  const { books, user, isLoggedIn, createBook, error, setError } = useContext(MyContext);
  const { bookshelves } = user || {};

  const location = useLocation()
  const navigate = useNavigate()

  const book = books.find((book) => book.id === bookId);

  console.log(bookshelves)
  useEffect(() => {
    setError(null); 
  }, [location]);

  useEffect(() => {
    if (user && user.books && bookId) {
      const userBook = user.books.find((book) => book.google_key === bookId);
      if (userBook) {
        //console.log('Book is in the library:', bookId);
        navigate(`/users/${user.id}/books/${userBook.id}`);
      }
    }
  }, [user, bookId, navigate]);
  
  

  if (!book) {
    return <div>Loading...</div>; 
  }

  const { volumeInfo } = book || {};
  const { title, authors, description, imageLinks, categories, pageCount, publishedDate } = volumeInfo || {};

  const coverImageUrl = imageLinks?.thumbnail || defaultbookimage;

 
  const handleAddtoLibrary = () => {
    createBook(title, authors, description, coverImageUrl, publishedDate, bookId);
  };
 

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
              src={coverImageUrl}
              alt={title}
              className="w-full sm:w-48 md:w-64 lg:w-80 h-auto object-cover rounded shadow-lg"
            />
          </figure>

          <div className="text-center mb-4">
            <div
              className="max-h-48 overflow-y-auto px-4 mx-auto"
              style={{
                maxHeight: "12rem",
                minHeight: "6rem",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              <p className="text-sm">{description || "No description available."}</p>
            </div>
          </div>

          {authors && authors.length > 0 && (
            <p className="text-center mb-4 text-lg">By {authors.join(", ")}</p>
          )}

          {/*{categories && (
            <p className="text-center mb-4 text-lg">Categories: {categories.join(", ")}</p>
          )}*/}

          {/*{pageCount && (
            <p className="text-center mb-4 text-lg">Page Count: {pageCount}</p>
          )}*/}

          {publishedDate && (
            <p className="text-center mb-4 text-lg">Published Date: {publishedDate}</p>
          )}

          {isLoggedIn && (
            <div className="flex justify-between items-center">
              <h1 className="text-3xl flex text-right font-bold">Your Bookshelves</h1>
              <div className="flex space-x-4">
                <NavLink to={`/users/${user.id}/bookshelves`}>
                  <button className="btn btn-primary btn-sm">Go To Your Bookshelves</button>
                </NavLink>
                <button 
                  onClick={handleAddtoLibrary} 
                  className="btn btn-primary btn-sm"
                >
                  Add to Your Library
                </button>
              </div>
            </div>
            )}
          {error && <div className="text-white text-right text-sm mb-4">{error}</div>}
          <div className="mt-6 p-4 border border-black rounded-lg shadow-lg">
            {isLoggedIn ? (
              <>
                <div className="flex overflow-x-auto space-x-4">
                  {bookshelves && bookshelves.length > 0 ? (
                    bookshelves.map((shelf) => (
                      <div className="w-60 p-4 flex-none" key={shelf.id}>
                        <BookshelvesCard shelf={shelf} book={book}  bookId={book.id} />
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

export default BookDetails;
