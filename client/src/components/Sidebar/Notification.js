import React from "react";
import { Box, Badge, makeStyles, withStyles } from "@material-ui/core";

const StyledBadge = withStyles((theme) => ({
  badge: {
    fontWeight: 800,
    position: "absolute",
    right: 0,

    top: 0,
    bottom: 0,
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    padding: 30,
    paddingLeft: 10,
  },
  badge: {
    right: 30,
    margin: 10,
  },
}));

const Notification = (props) => {
  const { counter } = props;
  const classes = useStyles();
  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.badge}>
          <StyledBadge badgeContent={counter} color={"primary"} />
        </Box>
      </Box>
    </>
  );
};

export default Notification;
