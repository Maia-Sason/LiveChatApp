const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

Conversation.matchToUser = async function (user1Id, conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
    },
  });

  if (
    !conversation ||
    (conversation.user1Id !== user1Id && conversation.user2Id !== user1Id) ||
    (conversation.user1Id === user1Id && conversation.user2Id === user1Id)
  ) {
    return false;
  } else {
    return true;
  }
};
// find conversation given two user Ids
Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
