import React, {useState, useContext} from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { MyContext } from "../../MyContext";

function Goals(){
    const {user, updateUserAttribute} = useContext(MyContext)
    const {goals} = user || {}

    const formSchema = yup.object().shape({
        name: yup.string().required("Must Enter A Goal Name.").max(50),
        description: yup.string().required("Must Enter A Goal Description").max(1000),
        progress: yup.string().required("Must Enter The Progress of the Goal").max(50),
      });
    
      const formik = useFormik({
        initialValues: { name: goals.name || "", description: goals.description || "", progress: goals.progress || "" },
        validationSchema: formSchema,
        onSubmit: (values) => {
          updateUserAttribute(values.name, values.description, values.progress);
          formik.resetForm();
        },
      });
    return(
        <div>
            <form onSubmit={formik.handleSubmit}>
              <label className="input bg-secondary input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Goal Name"
                  {...formik.getFieldProps("name")}
                />
              </label>
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}
               <label className="input bg-secondary input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Goal Description"
                  {...formik.getFieldProps("description")}
                />
              </label>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500">{formik.errors.description}</div>
              )}
               <label className="input bg-secondary input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Goal Progress"
                  {...formik.getFieldProps("progress")}
                />
              </label>
              {formik.touched.progress && formik.errors.progress && (
                <div className="text-red-500">{formik.errors.progress}</div>
              )}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-secondary">
                 Edit/Add Goal
                </button>
              </div>
            </form>
        </div>
    )
    
}
export default Goals