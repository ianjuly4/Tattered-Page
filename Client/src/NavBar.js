import React, { useContext } from "react";
import { MyContext } from "./MyContext";
import { useFormik } from "formik";
import * as yup from "yup";

function Navbar() {
  const { setQuery, setFilter } = useContext(MyContext) || {}; 

  const formSchema = yup.object().shape({
    searchTerm: yup.string().required("Must enter a search term").max(100),
    filter: yup.string().required("Must filter search term").oneOf(["name", "author", "genre"]),
  });

  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      filter: "name", 
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // When the form is submitted, update the context with form values
      setQuery(values.searchTerm);
      setFilter(values.filter);
    },
  });

  return (
    <div className="navbar bg-base-100 border-t-2 border-b-2 border-gray-300">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">The Tattered Page</a>
      </div>
      <div className="flex-none gap-2">
        <ul className="flex space-x-5">
          <li><a>Books</a></li>
          <li><a>Bookshelves</a></li>
        </ul>

        {/* Formik Form for the Search */}
        <form onSubmit={formik.handleSubmit}>
          <div className="form-control relative">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto pl-4 pr-16"
              value={formik.values.searchTerm}
              onChange={formik.handleChange}
              name="searchTerm"
              onBlur={formik.handleBlur}  
            />
            {formik.touched.searchTerm && formik.errors.searchTerm && (
              <div className="text-red-500 text-xs">{formik.errors.searchTerm}</div>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Navbar;
