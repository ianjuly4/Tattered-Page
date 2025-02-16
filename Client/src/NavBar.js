import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext"; 
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Navbar() {
  const { fetchBooks,  
    loading, 
    error: booksError, 
    loginError, 
    isLoggedIn,
    handleLogout,
    logout, 
    user } = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
      if (user && isLoggedIn) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }, [user, isLoggedIn]);

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
      navigate('/books');  
    },
  });

 
  const handleDropdownToggle = () => {
    console.log("navbar is dropped down")
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbar bg-base-100 sticky top-0 z-10">
      <div className="flex-1">
        <NavLink to={'/dashboard'}>
          <span className="btn btn-ghost text-xl">The Tattered Page</span>
        </NavLink>
      </div>
      <div className="flex-none gap-2">
        <ul className="flex space-x-5">
          <NavLink to ={'/bookclubs'}>
            <li>Bookclubs</li>
          </NavLink>
          <NavLink to={"/bookshelves"}>
            <li>Bookshelves</li>
          </NavLink>
        </ul>

        {/* Search form with dropdown filter */}
        <form onSubmit={formik.handleSubmit} className="flex items-center space-x-0">
          <div className="form-control relative flex items-center w-96">
            <select
              className="select select-bordered absolute right-20 pl-1"
              name="filter"
              value={formik.values.filter}
              onChange={formik.handleChange}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>

            <input
              type="text"
              placeholder="Search"
              className="input input-bordered pl-2 pr-16 w-full"
              value={formik.values.searchTerm}
              onChange={formik.handleChange}
              name="searchTerm"
            />
            {/* Show errors only after submit */}
            {formik.submitCount > 0 && formik.errors.searchTerm && (
              <div className="text-white text-xs">{formik.errors.searchTerm}</div>
            )}

            <button type="submit" className="btn btn-ghost ml-2 absolute right-1">
              Enter
            </button>
          </div>
        </form>

        {/* Display error or loading */}
        {loading && <div>Loading...</div>}
        {booksError && <div className="text-white text-xs">{booksError}</div>}
      </div>

      {/* Avatar and Dropdown */}
      <div className="dropdown dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-ghost btn-circle avatar" 
          onClick={handleDropdownToggle} 
        >
          <div className="w-10 rounded-full">
            {/* Conditionally render the avatar */}
            {user?.avatar ? (
              <img
                alt="User Avatar"
                src={user.avatar}
              />
            ) : (
              <div className="avatar placeholder">
                <div className="bg-secondary text-neutral-content w-53 rounded-full">
                  {/* If there's no avatar, display initials */}
                  <span>{user?.username ? user.username: "UN"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown menu - Show it conditionally based on dropdownOpen */}
        {dropdownOpen && (
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            style={{ display: dropdownOpen ? "block" : "none" }} 
          >
            <li>
              <NavLink to={"/account"}>Profile</NavLink>
            </li>
            
            {/* Conditionally render Login/Logout */}
            {isLoggedIn ? (
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            ) : (
              <li>
                <NavLink to={"/login"}>Login</NavLink>
              </li>
            )}
            <li>
              <NavLink to={"/signup"}>Signup</NavLink>
            </li>
          </ul>
          )}
      </div>
    </div>
  );
}

export default Navbar;
