import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import Layout from "./Layout";

import { register } from "./store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    paddingBottom: "2em",
  },
}));

const Login = (props) => {
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const classes = useStyles();

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Layout
      greeting={"Create an account."}
      headerPrompt={"Already have an account?"}
      buttonText={"Login"}
      handleClick={() => history.push("/login")}
      submit={"Create"}
      formSubmit={handleRegister}
    >
      <Grid>
        <FormControl margin="normal" className={classes.form}>
          <TextField
            aria-label="username"
            label="Username"
            name="username"
            type="text"
            required
          />
        </FormControl>
      </Grid>
      <Grid>
        <FormControl margin="normal" className={classes.form}>
          <TextField
            label="E-mail address"
            aria-label="e-mail address"
            type="email"
            name="email"
            required
          />
        </FormControl>
      </Grid>
      <Grid>
        <FormControl
          margin="normal"
          error={!!formErrorMessage.confirmPassword}
          className={classes.form}
        >
          <TextField
            aria-label="password"
            label="Password"
            type="password"
            inputProps={{ minLength: 6 }}
            name="password"
            required
          />
          <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid>
        <FormControl
          margin="normal"
          error={!!formErrorMessage.confirmPassword}
          className={classes.form}
        >
          <TextField
            label="Confirm Password"
            aria-label="confirm password"
            type="password"
            inputProps={{ minLength: 6 }}
            name="confirmPassword"
            required
          />
          <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
        </FormControl>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
