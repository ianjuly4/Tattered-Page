import React, { useContext } from "react";
import Header from "./Header";
import { useFormik } from "formik";
import * as yup from "yup";
import { MyContext } from "../MyContext";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useContext(MyContext);

  const navigate= useNavigate()

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
      signup(values.username, values.password);
      console.log(values.username, values.password)
      navigate('/account')
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
            <h1 className="text-5xl font-bold">Create Account</h1>
            <p className="py-6">
              Please create an account to utilize all of the features of the Tattered Page.
            </p>
            <NavLink to="/login">
              <p>Already have an Account? Click here to login.</p>
            </NavLink>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={formik.handleSubmit}>
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
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm">{formik.errors.username}</div>
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">{formik.errors.password}</div>
                )}
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
