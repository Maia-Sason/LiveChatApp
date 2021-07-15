import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6,
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5,
  },
  bubble: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "0 10px 10px 10px",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8,
  },
  dotContainer: {
    padding: 8,
    display: "flex",
  },
  shapeCircle: {
    borderRadius: "50%",
    backgroundColor: "white",
    opacity: 0.4,
    width: 6,
    height: 6,
    margin: 2,
  },
}));

const OtherUserBubbleLive = (props) => {
  const classes = useStyles();
  const { otherUser } = props;

  const circle = <div className={classes.shapeCircle} />;

  return (
    <Box className={classes.root}>
      <Avatar
        alt={otherUser.username}
        src={otherUser.photoUrl}
        className={classes.avatar}
      ></Avatar>
      <Box>
        <Typography className={classes.usernameDate}>
          {otherUser.username}
        </Typography>
        <Box className={classes.bubble}>
          <Box className={classes.dotContainer}>
            {circle}
            {circle}
            {circle}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OtherUserBubbleLive;
