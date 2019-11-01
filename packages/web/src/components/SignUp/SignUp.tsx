import { NextPage } from "next";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import Router from "next/router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { useSignupMutation } from "src/type/Graphql.type";
import { withApollo } from "src/utils/apollo";

interface FormValues {
  name: string;
  password: string;
}

const SignUp: NextPage = () => {
  const [signup, { data }] = useSignupMutation();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      password: ""
    },
    onSubmit: (values, formikHelpers) => {
      console.log("Sign Up");
      signup({ variables: values });
    }
  });

  useEffect(() => {
    if (data && data.signup) {
      Router.replace("/signin");
    }
  }, [data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Name"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <TextField
        label="Password"
        name="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default withApollo(SignUp);
