import React, { useContext } from "react";
import { MyContext } from "./MyContext"; 
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Navbar() {
  const { fetchBooks } = useContext(MyContext); 
  const navigate = useNavigate();
  
  const formSchema = yup.object().shape({
    searchTerm: yup.string().required("Must enter a search term").max(100),
    filter: yup.string().required("Must filter search term").oneOf(["title", "author", "genre"]),
  });

  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      filter: "title",  
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetchBooks(values.searchTerm, values.filter);
      navigate('/books')  
    },
  });

  return (
    <div className="navbar bg-base-100  sticky top-0 z-10">
      <div className="flex-1">
        <NavLink to={"/"}>
          <a className="btn btn-ghost text-xl">The Tattered Page</a>
        </NavLink>
      </div>
      <div className="flex-none gap-2">
        <ul className="flex space-x-5">
          <li><a>Bookclubs</a></li>
          <li><a>Bookshelves</a></li>
        </ul>

        {/* Search form with dropdown filter */}
        <form onSubmit={formik.handleSubmit} className="flex items-center space-x-0">
          {/* Container for input and dropdown */}
          <div className="form-control relative flex items-center w-96">
            {/* Dropdown for filter */}
            <select
              className="select select-bordered absolute right-20 pl-1"
              name="filter"
              value={formik.values.filter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered pl-2 pr-16 w-full"
              value={formik.values.searchTerm}
              onChange={formik.handleChange}
              name="searchTerm"
              onBlur={formik.handleBlur}
            />
            {formik.touched.searchTerm && formik.errors.searchTerm && (
              <div className="text-red-500 text-xs">{formik.errors.searchTerm}</div>  
            )}

            {/* Search button */}
            <button
              type="submit"  
              className="btn btn-ghost ml-2 absolute right-1"
            >
              Enter
            </button>
          </div>
        </form>
      </div>

      {/* Avatar and Dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User Avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
