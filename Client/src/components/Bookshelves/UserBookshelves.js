import React, { useState, useContext, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, useParams } from "react-router-dom";
import library from "../../assets/library.jpg";
import * as yup from "yup";
import { useFormik } from "formik";
import BookCard from "../Books/BookCard"; // Assuming BookCard is a component for displaying book details.

function UserBookshelves() {
  const { user, isLoggedIn, createBookshelf } = useContext(MyContext);
  const { bookshelves } = user || {};  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { bookId } = useParams();  // Getting bookId from the URL for Book Card
  
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
    },
  });

  useEffect(() => {
    if (!user && !isLoggedIn) {
      navigate("/login");
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
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      
      {/* Background div */}
      <div style={backgroundStyle}></div>
      
      {/* Content Section */}
      <div className="hero min-h-screen relative z-20">
        <div className="hero-content flex-col lg:flex-row">
          <div className="flex space-x-4 w-full">
            {/* Book Card - Left Section */}
            {bookId && (
              <div className="w-1/3">
                <BookCard bookId={bookId} />
              </div>
            )}
            
            {/* Create Bookshelf Form - Center Section */}
            <div className="w-1/3">
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

            {/* User's Library - Right Section */}
            <div className="w-1/3">
              <h2 className="text-3xl font-bold mt-24">Your Bookshelves</h2>
              <div className="text-2xl mt-6">
                <p className="mt-3">Here are your current bookshelves:</p>

                {/* Bookshelves Carousel */}
                <div className="border p-4 rounded-lg bg-white shadow-lg mt-4">
                  <div className="flex overflow-x-auto space-x-4">
                    {bookshelves && bookshelves.length > 0 ? (
                      bookshelves.map((shelf, index) => (
                        <div key={index} className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                          <h2 className="text-xl font-semibold">{shelf.name}</h2>
                          <p>{shelf.description}</p>
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
              </div>
            </div>
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
