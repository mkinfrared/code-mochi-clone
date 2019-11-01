import { NextPage } from "next";
import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { getCurrentUserRequest } from "src/store/reducers/user/actions";
import { useLoginMutation } from "src/type/Graphql.type";
import { withApollo } from "src/utils/apollo";

interface FormValues {
  name: string;
  password: string;
}

const Login: NextPage = () => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      password: ""
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        await login({ variables: values });
        dispatch(getCurrentUserRequest());
      } catch (e) {
        console.error(e);
      }
    }
  });

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

export default withApollo(Login);
