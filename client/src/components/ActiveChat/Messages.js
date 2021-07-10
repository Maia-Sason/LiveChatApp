import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, MiniAvatar } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  boxWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  boxContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const classes = useStyles();

  return (
    <Box>
      {messages.map((message, key) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <Box className={classes.boxWrapper}>
            <Box>
              <SenderBubble key={message.id} text={message.text} time={time} />
              {message.read === true && key === messages.length - 1 && (
                <Box className={classes.boxContainer}>
                  <MiniAvatar
                    altKey={otherUser.username}
                    srcKey={otherUser.photoUrl}
                  ></MiniAvatar>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
