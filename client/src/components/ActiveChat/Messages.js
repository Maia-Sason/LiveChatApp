import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, MiniAvatar } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message, key) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <Box display={"flex"} justifyContent="flex-end">
            <Box>
              <SenderBubble key={message.id} text={message.text} time={time} />
              {message.read === true && key === messages.length - 1 && (
                <MiniAvatar
                  altKey={otherUser.username}
                  srcKey={otherUser.photoUrl}
                ></MiniAvatar>
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
