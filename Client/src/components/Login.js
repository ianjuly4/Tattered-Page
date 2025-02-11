import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "../MyContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";

function Login() {
  const { login } = useContext(MyContext);
  const [errorMessage, setErrorMessage] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from || "/"; 

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
    onSubmit: async (values) => {
      const success = await login(values.username, values.password);

      if (success) {
       
        navigate(from, { replace: true });
      } else {
       
        setErrorMessage("Invalid username or password.");
      }
    },
  });

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <div className="hero bg-secondary min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Please login to utilize all of the features of the Tattered Page.
            </p>
            <NavLink to="/signup">
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
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>

              {/* Error Message (if login fails) */}
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
