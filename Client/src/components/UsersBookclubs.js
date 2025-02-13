import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { MyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

function UsersBookclubs(){

    const { user, isLoggedIn } = useContext(MyContext);
  const {bookclubs} = user || {}
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

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
      console.log(values.username, values.password);
      
    },
  });
  return()
}