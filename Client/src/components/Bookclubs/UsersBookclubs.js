import React, { useContext, useState, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import animecoffeeshop from "../../assets/animecoffeeshop.jpg";
import BookclubCard from "./BookclubCard";
import Footer from "../Footer"

function UsersBookclubs() {
  const { user, isLoggedIn, createBookclub, error, invites, setError } = useContext(MyContext);
  const { bookclubs } = user || {};  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const formSchema = yup.object().shape({
    name: yup.string().required("Must Enter A BookClub Name.").max(50),
    description: yup.string().required("Must Enter A Bookclub Description ").max(1000),
  });


  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      createBookclub(values.name, values.description);
    },
  });

  useEffect(() => {
    if (!user && !isLoggedIn) {
      navigate("/bookclubs");
    } else if (user) {
      navigate(`/users/${user.id}/bookclubs`);
    }
    setIsLoading(false);
  }, [user, isLoggedIn, navigate]);

  useEffect(() => {
      setError(null); 
  }, [location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You need to log in to view this page.</div>;
  }


  const backgroundStyle = {
      backgroundImage: `url(${animecoffeeshop})`,
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
      <div className="top-0 z-10">
        <Header />
      </div>
      <div style={backgroundStyle}></div>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">{"Bookclub Dashboard"}</h1>

            <div className="text-2xl mt-6">
              <p className="mt-3">Here are your current book clubs:</p>

              {/* Bookclubs Carousel */}
              <div className="p-4">
                <div className="flex overflow-x-auto space-x-4">
                  {bookclubs && bookclubs.length > 0 ? (
                    bookclubs.map((club, index) => (
                      <BookclubCard key={index} club={club} user={user} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Bookclubs Found, Please Create A Bookclub.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form to create a bookclub */}
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
                <div className="text-white">{formik.errors.name}</div>
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
                <div className="text-white">{formik.errors.description}</div>
              )}

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Create Bookclub
                </button>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default UsersBookclubs;
