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

    const convoId = [];

    for (let i = 0; i < conversations.length; i++) {
     
     
      const convo = conversations[i];

      convoId.push(convo.id);

      const convoJSON = convo.toJSON();


      try {
        const count = await Message.count({
          where: {
            conversationId: convo.id,
            read: false,
            senderId: { [Op.not]: userId },
          },
        });

        convoJSON.count = count;
      } catch (error) {
        next(error);
      }

      convoJSON.messages.reverse();


      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers[convoJSON.otherUser.id]) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview

      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;

      if (
        req.user.id ===
        convoJSON.messages[convoJSON.messages.length - 1].senderId
      ) {
        convoJSON.latestMessageRead = true;
      } else {
        convoJSON.latestMessageRead =
          convoJSON.messages[convoJSON.messages.length - 1].read;
      }

      conversations[i] = convoJSON;
    }

    const dataJSON = Object.assign({}, { conversations }, { convoId });

    res.json(dataJSON);
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

    const { id } = req.body;
    const senderId = req.user.id;
    const conversationId = id;

    if (!conversationId) {
      return res.json({ id: null });
    }

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
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
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

    const messages = await Message.findAll({
      where: { conversationId: conversationId },
    });

    for (let i = 0; i < conversation.messages.length; i++) {
      if (req.user.id !== conversation.messages[i].senderId) {
        try {
          const result = await conversation.messages[i].update({ read: true });
        } catch (err) {
          next(error);
        }
      }
    }

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
    if (onlineUsers[convoJSON.otherUser.id]) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    convoJSON.count = 0;

    convoJSON.latestMessageText =
      convoJSON.messages[convoJSON.messages.length - 1].text;

    if (
      convoJSON.messages[convoJSON.messages.length - 1].senderId === senderId
    ) {
      convoJSON.latestMessageRead = true;
    } else {
      convoJSON.latestMessageRead =
        convoJSON.messages[convoJSON.messages.length - 1].read;
    }

    res.json(convoJSON);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
