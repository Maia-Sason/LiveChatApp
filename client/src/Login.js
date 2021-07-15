import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Grid, FormControl, TextField, makeStyles } from "@material-ui/core";

import { login } from "./store/utils/thunkCreators";
import FormLayout from "./FormLayout";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    paddingBottom: "2em",
  },
}));


const Login = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <FormLayout
      greeting={"Welcome back!"}
      headerPrompt={"Don't have an account?"}
      buttonText={"Create account"}
      handleClick={() => history.push("/register")}
      formSubmit={handleLogin}
      submit={"Login"}
    >
      <Grid>
        <FormControl margin="normal" required className={classes.form}>
          <TextField
            aria-label="username"
            label="Username"
            name="username"
            type="text"
          />
        </FormControl>
      </Grid>
      <FormControl margin="normal" required className={classes.form}>
        <TextField
          label="password"
          aria-label="password"
          type="password"
          name="password"
        />
      </FormControl>
    </FormLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
