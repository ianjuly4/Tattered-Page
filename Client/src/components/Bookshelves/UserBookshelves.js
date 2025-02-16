import React, { useContext, useState, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate } from "react-router-dom";
import library from "../../assets/library.jpg";
import * as yup from "yup";
import { useFormik } from "formik";
import BookshelvesCard from "../Bookshelves/BookshelvesCard";

function UserBookshelves() {
  const { user, isLoggedIn, createBookshelf } = useContext(MyContext);
  const { bookshelves, books } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    name: yup.string().required("Must Enter A Bookshelf Name.").max(25),
    description: yup.string().required("Must Enter A Bookshelf Description").max(500),
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

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-30">
        <Header />
      </div>

      {/* Background div */}
      <div style={backgroundStyle}></div>

      {/* Content Section */}
      <div className="hero min-h-screen relative z-20 pt-20">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Your Bookshelves</h1>

            <div className="text-2xl mt-6">
              {/* Books section - Stack Bookshelves Vertically */}
              <div className="space-y-8">
                {bookshelves && bookshelves.length > 0 ? (
                  bookshelves.map((shelf) => (
                    <div key={shelf.id} className="p-4 bg-white rounded-lg shadow-lg">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{shelf.name}</h2>
                        <p>{shelf.genre}</p>
                      </div>
                      <p>{shelf.description}</p>

                      {/* Bookshelf Carousel: Display books inside a shelf */}
                      <div className="carousel mt-4 w-full">
                        {shelf.books && shelf.books.length > 0 ? (
                          shelf.books.map((book, idx) => (
                            <div
                              key={idx}
                              id={`book-carousel-item-${idx}`}
                              className="carousel-item w-full"
                            >
                              <div className="card w-64 bg-gray-200 rounded-lg shadow-lg">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-64 object-cover rounded-t-lg"
                                />
                                <div className="p-4">
                                  <h3 className="font-semibold">{book.title}</h3>
                                  <p className="text-sm text-gray-500">{book.author}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>No books available for this bookshelf.</div>
                        )}
                      </div>

                      {/* Button to view bookshelf details */}
                      <button className="btn btn-primary btn-sm mt-4">View Shelf</button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center">
                    <p>No Bookshelves Found, Please Create One.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form to create a bookshelf */}
            <h2 className="text-3xl justify-center flex items-center font-bold mt-24">Create A Bookshelf</h2>

            <form onSubmit={formik.handleSubmit}>
              <label className="input input-bordered flex items-center gap-2">
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

              <label className="input input-bordered flex items-center gap-2 mt-4">
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

              <label className="input input-bordered flex items-center gap-2 mt-4">
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

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Create Bookshelf
                </button>
              </div>
            </form>
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

export default UserBookshelves;
