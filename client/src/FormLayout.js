import React from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import { TopButton } from "./components/form";

import HeroImage from "./components/HeroImage/HeroImage";
import { FormButton } from "./components/form";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  rootform: {
    height: "100%",
  },
  header: {
    fontWeight: "bold",
    paddingTop: "1em",
    paddingBottom: "1em",
    whiteSpace: "nowrap",
  },
  inset: {
    padding: "2em",
    height: "calc(100% - 4em)",
  },
  formWidth: {
    width: "50vw",
  },
  loginContainer: {
    padding: "20px",
  },
}));

const FormLayout = ({
  children,
  headerPrompt,
  buttonText,
  handleClick,
  greeting,
  submit,
  formSubmit,
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
                  <form onSubmit={formSubmit}>
                    {children}
                    <Grid
                      item
                      container
                      justifyContent="center"
                      className={classes.loginContainer}
                    >
                      <FormButton
                        type={"submit"}
                        clr={"white"}
                        bgc={"#3A8DFF"}
                        button={submit}
                      />
                    </Grid>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FormLayout;
