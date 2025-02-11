import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { MyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
import animecoffeeshop from "../assets/animecoffeeshop.jpg";
import * as yup from "yup";
import {useFormik} from "formik";

function Bookclubs() {
  const { user, isLoggedIn } = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [bookclubs, setBookclubs] = useState([
    { id: 1, name: "Fantasy Book Club", description: "A club for lovers of fantasy books." },
    { id: 2, name: "Mystery Book Club", description: "Join us to solve thrilling mysteries!" },
    { id: 3, name: "Sci-Fi Book Club", description: "For all things science fiction." },
  ]);

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username.").max(25),
    password: yup.string().required("Must enter a password").max(25),
  });


  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      //signup(values.username, values.password);
      console.log(values.username, values.password)
      //navigate('/account')
    },
  });


 
  useEffect(() => {
    if (user && isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [user, isLoggedIn]);

  const handleLoginRedirect = () => {
    navigate("/auth/login", { state: { from: "/users/:userId/bookclubs" } });
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="hero bg-secondary min-h-screen flex justify-center items-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="hero bg-secondary min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          {isAuthenticated ? (
            // If logged in, show the Bookclub dashboard
            <div className="text-center lg:text-left">
         <h1 className="text-5xl font-bold">{ `${user.username}'s Bookclub Dashboard`}</h1>


              <div className="text-2xl mt-6">
                <p className="mt-3">Here are your current book clubs:</p>

                {/* Bookclubs Carousel with styled box */}
                <div className="carousel carousel-center bg-neutral rounded-box max-w-full space-x-4 p-4 mt-8">
                  {bookclubs.map((club) => (
                    <div key={club.id} className="carousel-item w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                      <h2 className="text-xl font-semibold">{club.name}</h2>
                      <p>{club.description}</p>
                      <button className="btn btn-primary btn-sm mt-4">Join Club</button>
                    </div>
                  ))}
                </div>
                <h2 className="text-3xl  font-bold mt-6">Create A Bookclub</h2>
                <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Search" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                    </svg>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input type="text" className="grow" placeholder="Email" />
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" className="grow" placeholder="Username" />
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70">
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                    </svg>
                    <input type="password" className="grow" value="password" />
                  </label>
              </div>
            </div>
          ) : (
            // If not logged in, show the introduction section
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full">
              {/* Text on the left */}
              <div className="text-center lg:text-left lg:w-1/2">
                <h1 className="text-5xl font-bold">Welcome to Bookclub</h1>
                <p className="py-6">
                  Looking for your next great read? Or perhaps a cozy community to share your thoughts with? Bookclub is the perfect place for book lovers like you! Whether you're diving into a thrilling novel, exploring thought-provoking nonfiction, or sharing your latest book recommendations, we've got a club for everyone.
                  <p className="mt-4">
                    Here’s what you can expect:
                  </p>
                  <p className="mt-4">
                    Join or Create Clubs: Find a Bookclub that matches your interests or create your own to gather like-minded readers!
                    Interactive Discussions: Engage in lively book discussions, share your thoughts, and get fresh perspectives from fellow members.
                    Read & Share: Track your reading progress, share reviews, and explore exciting new genres with fellow bibliophiles.
                    Start your reading journey today – your next favorite book is just a click away!
                  </p>
                </p>
                <div className="text-center mt-4">
                  <button
                    onClick={handleLoginRedirect}
                    className="btn btn-primary mt-4"
                  >
                    Login To Get Started
                  </button>
                </div>
              </div>

              {/* Image on the right */}
              <div className="flex justify-center lg:justify-end lg:w-1/2 mt-6 lg:mt-0">
                <img
                  src={animecoffeeshop}
                  alt="anime coffee shop"
                  className="max-w-lg rounded-lg shadow-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookclubs;
