import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import Image from "../../resources/images/bg-img.png";
import { ReactComponent as SVG } from "../../resources/images/bubble.svg";
import "./hero.css";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundImage: `url(${Image})`,
    height: "100vh",
    width: "100%",
    backgroundSize: "cover",
  },
  inner: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(to top, #3A8DFF 0%,rgba(134, 185, 255, .85) 100%)",
  },
  text: {
    textAlign: "center",
    margin: "10px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    fontWeight: 600,
    whiteSpace: "no-wrap",
  },
  logo: {
    paddingBottom: "40px",
    display: "flex",
    justifyContent: "center",
  },
  padding: {
    paddingBottom: "90px",
  },
}));

const HeroImage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.main}>
      <Box className={classes.inner}>
        <Box className={classes.padding}>
          <Box className={classes.logo}>
            <SVG height="6em"></SVG>
          </Box>
          <Box className={classes.text}>
            <Typography variant="h4">
              Converse with anyone with any language
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroImage;
