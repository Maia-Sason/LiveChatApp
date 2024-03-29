import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Notification } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    color: "black",
    fontWeight: 700,
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const {
    latestMessageText,
    otherUser,
    latestMessageRead,
    live,
  } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        {live ? (
          <Typography className={classes.previewText}>
            <em>Typing...</em>
          </Typography>
        ) : (
          <>
            {latestMessageRead ? (
              <Typography className={classes.previewText}>
                {latestMessageText}
              </Typography>
            ) : (
              <Typography className={classes.previewTextUnread}>
                {latestMessageText}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatContent;
