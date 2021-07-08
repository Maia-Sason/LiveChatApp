import React from "react";
import { Box, Avatar, makeStyles, withStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "1.2em",
    width: "1.2em",
    marginTop: "10px",
  },
}));

const MiniAvatar = (props) => {
  const { altKey, srcKey } = props;

  const classes = useStyles();

  return (
    <>
      <Avatar className={classes.root} alt={altKey} src={srcKey}></Avatar>
    </>
  );
};

export default MiniAvatar;
