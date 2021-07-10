import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { login } from "./store/utils/thunkCreators";

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
              Don't have an account?
            </Typography>
            <Box className={classes.spacing}>
              <Button
                elevation={10}
                size={"large"}
                className={classes.button}
                variant="contained"
                onClick={() => history.push("/register")}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container item justifyContent="center" xs={12}>
        <Grid item>
          <Box className={classes.formWidth}>
            <form onSubmit={handleLogin}>
              <Grid>
                <Typography variant="h4" className={classes.header}>
                  Welcome back!
                </Typography>
                <Grid>
                  <FormControl
                    margin="normal"
                    required
                    className={classes.form}
                  >
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
                      Login
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
