import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import { TopButton } from "./components/form";

import HeroImage from "./components/HeroImage/HeroImage";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  rootform: {
    height: "100%",
  },
  header: {
    fontWeight: "bold",
    paddingBottom: "40px",
  },
  inset: {
    padding: "2em",
    height: "calc(100% - 4em)",
  },
  formWidth: {
    width: "50vw",
  },
}));

const Layout = ({
  children,
  headerPrompt,
  buttonText,
  handleClick,
  greeting,
}) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item md={4} sm={12}>
        <HeroImage />
      </Grid>
      <Grid item md={8} sm={12} className={classes.rootform}>
        <Box className={classes.inset}>
          <Grid
            container
            direction="row"
            JustifyContent="space-around"
            className={classes.rootform}
          >
            <Grid container item xs={12} justifyContent="flex-end">
              <TopButton
                prompt={headerPrompt}
                button={buttonText}
                location={handleClick}
              />
            </Grid>

            <Grid container item justifyContent="center" xs={12}>
              <Grid item>
                <Box className={classes.formWidth}>
                  <Typography variant="h4" className={classes.header}>
                    {greeting}
                  </Typography>
                  {children}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Layout;
