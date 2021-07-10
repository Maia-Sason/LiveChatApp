import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";

import { register } from "./store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  header: {
    fontWeight: "bold",
  },
  registerContainer: {
    padding: "10px",
    paddingTop: "30px",
    justifyContent: "flex-end",
    whiteSpace: "no-wrap",
    display: "flex",
  },
  spacing: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  textTop: {
    paddingTop: "9px",
    color: "grey",
  },
  button: {
    color: "#3A8DFF",
    background: "white",
  },
  formWidth: {
    width: "50vw",
  },
  form: {
    width: "100%",
  },
  login: {
    backgroundColor: "#3A8DFF",
    color: "white",
  },
  loginContainer: {
    padding: "20px",
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
    <Grid
      className={classes.root}
      container
      direction="row"
      JustifyContent="space-around"
    >
      <Grid item container xs={12} justifyContent="flex-end">
        <Grid item xs={12} sm={7}>
          <Box className={classes.registerContainer}>
            <Typography className={classes.textTop}>
              Already have an account?
            </Typography>
            <Box className={classes.spacing}>
              <Button
                className={classes.button}
                size={"large"}
                variant="contained"
                onClick={() => history.push("/login")}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container item justifyContent="center" xs={12}>
        <Grid item>
          <Box className={classes.formWidth}>
            <form onSubmit={handleRegister}>
              <Grid>
                <Typography variant="h4" className={classes.header}>
                  Create an account.
                </Typography>
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
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
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
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <FormControl margin="normal" required className={classes.form}>
                  <Grid
                    item
                    container
                    justifyContent="center"
                    className={classes.loginContainer}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      className={classes.login}
                    >
                      Create
                    </Button>
                  </Grid>
                </FormControl>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Grid>
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
