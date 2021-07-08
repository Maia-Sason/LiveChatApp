const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      console.log(convoJSON.messages[0].senderId);
      console.log(req.user.id);

      convoJSON.count = 0;
      for (let i = 0; i < convoJSON.messages.length; i++) {
        if (
          req.user.id !== convoJSON.messages[i].senderId &&
          !convoJSON.messages[i].read
        ) {
          convoJSON.count++;
        }
      }

      if (req.user.id === convoJSON.messages[0].senderId) {
        convoJSON.latestMessageRead = true;
      } else {
        console.log(convoJSON.messages[0].read);
        convoJSON.latestMessageRead = convoJSON.messages[0].read;
      }
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Set all posts who are not owned by user to unread. Set count to 0.
router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    console.log(req.body);
    const { id } = req.body;
    const senderId = req.user.id;
    const conversationId = id;

    const isUserConversation = await Conversation.matchToUser(
      senderId,
      conversationId
    );

    if (!isUserConversation) {
      return res.sendStatus(401);
    }

    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: senderId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: senderId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversation.messages.length; i++) {
      if (req.user.id !== conversation.messages[i].senderId) {
        try {
          console.log(conversation.messages[i]);
          const result = await conversation.messages[i].update({ read: true });
        } catch (err) {
          next(error);
        }

        console.log(conversation.messages[i]);
      }
    }

    // conversation.save();

    const convoJSON = conversation.toJSON();

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    // set property for online status of the other user
    if (onlineUsers.includes(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    convoJSON.count = 0;
    //console.log(conversation);
    // console.log(convoJSON);

    // Needs changing
    convoJSON.latestMessageText = convoJSON.messages[0].text;
    if (convoJSON.messages[0].senderId === senderId) {
      convoJSON.latestMessageRead = true;
    } else {
      convoJSON.latestMessageRead = convoJSON.messages[0].read;
    }

    res.json(convoJSON);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
