import React, {useContext} from "react";
import Header from "./Header";
import { useFormik } from "formik";
import * as yup from "yup"
import { MyContext } from "../MyContext";

function LoginCreate(){
    const{login} = useContext(MyContext)

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username.").max(25),
        password: yup.string().required("Must enter a password").max(25),
      });
    
      const loginFormik = useFormik({
        initialValues: {
          username: "",
          password: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
          login(values.username, values.password);
        },
      });

    return(
        <div>
        <div className="sticky top-0 z-10">
            <Header/>
        </div>
        <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
            Please login to utilize all of the features of this
            </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body">
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" className="input input-bordered" required />
                </div>
                <div className="form-control">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="password" className="input input-bordered" required />
                <label className="label">
                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
                </div>
                <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
    )
}
export default LoginCreate;