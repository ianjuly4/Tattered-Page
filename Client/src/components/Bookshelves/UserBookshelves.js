import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, NavLink } from "react-router-dom";
import library from "../../assets/library.jpg";
import * as yup from "yup";
import { useFormik } from "formik";

function UserBookshelves() {
  const { user, isLoggedIn, createBookshelf, deleteBook } = useContext(MyContext);
  const { bookshelves, books } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  console.log(books)

  const formSchema = yup.object().shape({
    name: yup.string().required("Must Enter A Bookshelf Name.").max(25),
    description: yup.string().required("Must Enter A Bookshelf Description").max(1000),
    genre: yup.string().required("Must Enter A Bookshelf Genre").max(25),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      genre: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      createBookshelf(values.name, values.description, values.genre);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (!user && !isLoggedIn) {
      navigate("/bookshelves");
    }
    setIsLoading(false);
  }, [user, isLoggedIn, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>You need to log in to view this page.</div>;
  }

  const allBooks = Array.isArray(bookshelves) ? bookshelves.flatMap((shelf) => shelf.books || []) : [];

  const backgroundStyle = {
    backgroundImage: `url(${library})`,
    backgroundSize: "150%",
    backgroundPosition: "center",
    minHeight: "100vh",
    filter: "blur(6px)",
    opacity: 0.6,
    backgroundRepeat: "no-repeat",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };
  const handleDeleteBook = (bookId) => {
    deleteBook(bookId)
  };
  
  

  return (
    <div>
      <div className=" top-0 z-10">
        <Header />
      </div>

      {/* Background div */}
      <div style={backgroundStyle}></div>

      {/* Content Section */}
      <div className="hero min-h-screen mt-6 justify-center items-center text-left relative z-20 pt-20">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-left lg:text-left">
            <h1 className="text-5xl font-bold">Your Bookshelves</h1>

            <div className="text-2xl mt-6">
              {/* Bookshelf Section */}
              <div className="space-y-8">
              {bookshelves && bookshelves.length > 0 ? (
                bookshelves.map((shelf) => (
                  <div
                    key={shelf.id}
                    className="p-4 bg-secondary rounded-lg shadow-lg max-w-4xl mx-auto"
                  >
                    <h2 className="text-3xl font-semibold">{shelf.name}</h2>

                    {/* Carousel for Books inside the Bookshelf */}
                    <div className="carousel mt-4 w-full overflow-x-auto flex gap-6 py-4">
                    {shelf.books && shelf.books.length > 0 ? (
                        shelf.books.map((book) => {
                          const authors = Array.isArray(book.author)
                            ? book.author.join(", ")
                            : book.author;

                          return (
                            <div
                              key={book.id}  
                              id={`book-carousel-item-${book.id}`}  
                              className="carousel-item w-40 flex-shrink-0"
                            >
                              <div className="card bg-gray-200 rounded-lg shadow-lg">
                                <img
                                  src={book.cover_image}
                                  alt={book.title}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <button
                                  onClick={() => handleDeleteBook(book.id, shelf.id)}
                                  className="btn btn-primary btn-sm "
                                >
                                  Remove Book
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div>No books available for this bookshelf.</div>
                      )}

                    </div>

                    <button className="btn btn-primary btn-sm mt-4">View Shelf</button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-left">
                  <p>No Bookshelves Found, Please Create One.</p>
                </div>
              )}
            </div>

            </div>

            <h2 className="text-5xl mt-12 font-semibold text-left mb-6">All Books You've Added</h2>
                <div className="py-8 p-8 container bg-secondary rounded-lg">
                  <div className="max-h-96 overflow-y-auto px-4 rounded-lg shadow-md">
                    {/* Consistent Grid for Books */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {books.length > 0 ? (
                        books.map((book) => (
                          <div key={book.id} className="p-4">
                            {/* Wrap only the book card (excluding the delete button) with NavLink */}
                            <NavLink to={`/users/${user.id}/books/${book.id}`} className="card bg-gray-200 rounded-lg shadow-lg w-full">
                              <img
                                src={book.cover_image}
                                alt={book.title}
                                className="w-full h-32 object-cover rounded-t-lg"
                              />
                              <div className="p-4">
                                <h3 className="font-semibold">{book.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {(() => {
                                    let authors = book.author;
                                    if (typeof authors === 'string') {
                                      try {
                                        if (authors.startsWith("{") && authors.endsWith("}")) {
                                          authors = authors.slice(1, -1).split(",").map(item => item.replace(/"/g, '').trim());
                                        }
                                      } catch (error) {
                                        console.error('Error parsing author string:', error);
                                        return authors;
                                      }
                                    }
                                    return Array.isArray(authors) ? authors.join(", ") : authors;
                                  })()}
                                </p>
                              </div>
                            </NavLink>

                            {/* Place Delete Button outside the NavLink */}
                            <button 
                              onClick={() => handleDeleteBook(book.id)} 
                              type="button" 
                              className="btn mt-4 w-full"
                            >
                              Delete Book
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-left py-8">
                          <h3 className="text-xl">No books have been added yet. Please add some books to your bookshelves!</h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

            {/* Form to create a bookshelf */}
            <h2 className="text-3xl justify-center flex items-center font-bold mt-24 text-left">Create A Bookshelf</h2>

            <form onSubmit={formik.handleSubmit}>
              <label className="input bg-secondary input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Bookshelf Name"
                  {...formik.getFieldProps("name")}
                />
              </label>
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}

              <label className="input bg-secondary input-bordered flex items-center gap-2 mt-4">
                <input
                  type="text"
                  className="grow"
                  placeholder="Bookshelf Description"
                  {...formik.getFieldProps("description")}
                />
              </label>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500">{formik.errors.description}</div>
              )}

              <label className="input bg-secondary input-bordered flex items-center gap-2 mt-4">
                <input
                  type="text"
                  className="grow"
                  placeholder="Bookshelf Genre"
                  {...formik.getFieldProps("genre")}
                />
              </label>
              {formik.touched.genre && formik.errors.genre && (
                <div className="text-red-500">{formik.errors.genre}</div>
              )}

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-secondary">
                  Create Bookshelf
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-white mt-20 py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default UserBookshelves;
