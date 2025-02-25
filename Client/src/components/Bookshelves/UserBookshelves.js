import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, NavLink } from "react-router-dom";
import library from "../../assets/library.jpg";
import * as yup from "yup";
import { useFormik } from "formik";
import UserBookCard from "../Books/UserBookCard";
import Footer from "../Footer";

function UserBookshelves() {
  const { user, isLoggedIn, createBookshelf, deleteBook, deleteShelf } = useContext(MyContext);
  const { bookshelves, books } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup.string().required("Must Enter A Bookshelf Name.").max(50),
    description: yup.string().required("Must Enter A Bookshelf Description").max(1000),
    genre: yup.string().required("Must Enter A Bookshelf Genre").max(50),
  });

  const formik = useFormik({
    initialValues: { name: "", description: "", genre: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      createBookshelf(values.name, values.description, values.genre);
      formik.resetForm();
    },
  });

  console.log(user);
  console.log(bookshelves);

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

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId);
  };
  const handleDeleteShelf = (shelfId) => {
    deleteShelf(shelfId);
  };

  const backgroundStyle = {
    backgroundImage: `url(${library})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header />
      {/* Background */}
      <div style={backgroundStyle}></div>

      <div className="hero min-h-screen mt-6 justify-center items-center text-left relative z-20 pt-20">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-left lg:text-left">
            <h1 className="text-5xl font-bold">Your Bookshelves</h1>

            {/* Bookshelves Section */}
            <div className="space-y-8 mt-6">
              {bookshelves && bookshelves.length > 0 ? (
                bookshelves.map((shelf) => (
                  <div
                    key={shelf.id}
                    className="p-4 rounded-lg shadow-lg max-w-4xl mx-auto border-4 border-black" 
                  >
                    <h2 className="text-3xl font-semibold">{shelf.name}</h2>

                    {/* Carousel for Books inside the Bookshelf */}
                    <div className="carousel mt-4 w-full overflow-x-auto flex gap-6 py-4  p-4"> 
                      {shelf.books && shelf.books.length > 0 ? (
                        shelf.books.map((book) => (
                          <div
                            key={book.id}
                            className="carousel-item w-40 flex-shrink-0" 
                          >
                            <div>
                              <img
                                src={book.cover_image}
                                alt={book.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No books available for this bookshelf.</div>
                      )}
                    </div>
                    <div className="flex space-x-4 mt-8">
                      <NavLink to={`/users/${user.id}/bookshelves/${shelf.id}`}>
                        <button className="btn btn-primary btn-sm">View Shelf</button>
                      </NavLink>
                      <button
                        onClick={() => handleDeleteShelf(shelf.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Delete Shelf
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Bookshelves Found. Please Create One.</p>
              )}
            </div>

            {/* All Books Added */}
            <h2 className="text-5xl mt-12 font-semibold text-left mb-6">All Books You've Added</h2>
            <div className="py-8 p-8 container">
              <div className="max-h-96 overflow-y-auto px-4">
                {/* Check if there are books, otherwise show a placeholder */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {books.length > 0 ? (
                    books.map((book) => (
                      <div key={book.id} className="p-4">
                        {/* Book card wrapped with NavLink */}
                        <NavLink
                          to={`/users/${user.id}/books/${book.id}`}
                          className="card bg-gray-200 rounded-lg shadow-lg w-full border-2 border-gray-800" 
                        >
                          <UserBookCard book={book} />
                        </NavLink>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          type="button"
                          className="btn w-full mt-2"
                        >
                          Delete Book
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 p-8">
                      <p className="text-xl font-semibold text-left mb-4">
                        No books have been added yet. Please add some books to your bookshelves!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Create Bookshelf Form */}
            <h2 className="text-3xl justify-center flex items-center font-bold mt-24 text-left">
              Create A Bookshelf
            </h2>
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

      <Footer />
    </div>
  );
}

export default UserBookshelves;
