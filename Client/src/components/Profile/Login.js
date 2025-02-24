// Login Component
import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "../../MyContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";

function Login() {
  const { login, user, error, setError, isLoggedIn } = useContext(MyContext);
  
  const navigate = useNavigate();
  const location = useLocation();
 

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username.").max(25),
    password: yup.string().required("Must enter a password").max(25),
  });

  const loginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
      validationSchema: formSchema,
      onSubmit: (values) => {
    
        login(values.username, values.password);
      },
      else:{
       
      }
    });
    
  
  useEffect(()=>{
    if (user && isLoggedIn){
      navigate(`/users/${user.id}`)
    }
  })
  
  useEffect(() => {
    setError(null); 
  }, [location]);

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="hero bg-secondary min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">Please login to utilize all of the features of the Tattered Page.</p>
            <NavLink to={"/users"}>
              <p>Don't have an account? Click here to create one.</p>
            </NavLink>
          </div>

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={loginFormik.handleSubmit}>
              {/* Username Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered"
                  value={loginFormik.values.username}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.username && loginFormik.errors.username && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.username}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.password}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                   {/* Error Message (if login fails) */}
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
