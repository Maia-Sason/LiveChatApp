import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";

import { FormButton } from "./";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
  },
  spacing: { paddingLeft: "20px" },
  text: {
    paddingTop: "15px",
    color: "grey",
    whiteSpace: "nowrap",
  },
}));

const TopButton = ({ prompt, button, location, type }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography className={classes.text}>{prompt}</Typography>

      <Box className={classes.spacing}>
        <FormButton
          type={type}
          handleClick={location}
          button={button}
          clr={"#3A8DFF"}
          bgc={"white"}
        />
      </Box>
    </Box>
  );
};

export default TopButton;
