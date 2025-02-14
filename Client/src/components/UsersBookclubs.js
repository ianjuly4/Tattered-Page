import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { MyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

function UsersBookclubs() {
  const { user, isLoggedIn, createbookclub } = useContext(MyContext);
  const { bookclubs } = user || {};
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    ame: yup.string().required("Must Enter A BookClub Name.").max(25),
    description: yup.string().required("Must Enter A Bookclub Description ").max(500),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values.name, values.description);
      createbookclub(values.name, values.description)
    },
  });

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      
      <div className="hero bg-secondary min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">{`${user.username}'s Bookclub Dashboard`}</h1>

              <div className="text-2xl mt-6">
                <p className="mt-3">Here are your current book clubs:</p>

                {/* Bookclubs Carousel */}
                <div className="border p-4 rounded-lg bg-white shadow-lg">
                  <div className="flex overflow-x-auto space-x-4">
                    {bookclubs.length > 0 ? (
                      bookclubs.map((club, index) => (
                        <div key={index} className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                          <h2 className="text-xl font-semibold">{club.name}</h2>
                          <p>{club.description}</p>
                          <button className="btn btn-primary btn-sm mt-4">Join Club</button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center">
                        <p>No Bookclubs Found, Please Create A Bookclub.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form to create bookclub */}
              <h2 className="text-3xl justify-center flex items-center font-bold mt-24">Create A Bookclub</h2>

              <form onSubmit={formik.handleSubmit}>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Bookclub Name"
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
                    placeholder="Bookclub Description"
                    {...formik.getFieldProps("description")}
                  />
                </label>
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500">{formik.errors.description}</div>
                )}

                {/* Submit Button */}
                <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Create Bookclub
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

export default UsersBookclubs;
