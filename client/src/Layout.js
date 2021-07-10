import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Box, makeStyles } from "@material-ui/core";

import HeroImage from "./components/HeroImage/HeroImage";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item sx={0} sm={4}>
        <HeroImage />
      </Grid>
      <Grid item xs={12} sm={8}>
        {children}
      </Grid>
    </Grid>
  );
};

export default Layout;
