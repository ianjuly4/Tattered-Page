import React, { useContext } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import defaultbookimage from "../../assets/defaultbookimage.jpg";
import { NavLink, useParams } from "react-router-dom";
import BookshelvesCard from "../Bookshelves/BookshelvesCard"

function BookDetails() {
  const { bookKey } = useParams();
  const { books, user, isLoggedIn } = useContext(MyContext);
  const { bookshelves } = user || {};

  const bookId = bookKey.replace('/works/', '');
  const book = books.find((book) => book.id === bookId);

  console.log(book.id)

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
        <div className="card bg-secondary shadow-xl p-6 rounded-lg">

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
            <div
              className="max-h-48 overflow-y-auto px-4"
              style={{
                maxHeight: '12rem', 
                minHeight: '6rem',
              }}
            >
              <p className="text-sm">{description || "No description available."}</p>
            </div>
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

          {/* Action Section with Buttons */}
          {isLoggedIn && (
            <div className="flex  w-full justify-between">
              {/* Title for Bookshelves aligned to the left */}
              <h1 className="text-3xl flex text-right font-bold"> Your Bookshelves</h1>
              
              {/* Button to Go To Your Bookshelves aligned to the right */}
              <NavLink to={`/users/${user.id}/bookshelves/${book.id}`}>
                <button className="btn btn-primary  btn-sm">Go To Your Bookshelves</button>
              </NavLink>
            </div>
          )}



       {/* Bookshelves Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          {isLoggedIn ? (
            <>
              

              {/* Bookshelves Carousel */}
              <div className="flex overflow-x-auto space-x-4">
                {bookshelves && bookshelves.length > 0 ? (
                  bookshelves.map((shelf) => (
                    <NavLink key={shelf.id} to={`/users/${user.id}/bookshelves/${bookshelves.id}`} className="block">
                    <div  className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                      <BookshelvesCard/>
                    </div>
                    </NavLink>

                  ))
                ) : (
                  <div className="col-span-3 text-center">
                    <p>No Bookshelves Found, Please Create A Bookshelf.</p>
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

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default BookDetails;
