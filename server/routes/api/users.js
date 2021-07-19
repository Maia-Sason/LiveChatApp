const router = require("express").Router();
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// find users by username
router.get("/:username", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { username } = req.params;

    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: username,
        },
        id: {
          [Op.not]: req.user.id,
        },
      },
    });

    // add online status to each user that is online
    for (let i = 0; i < users.length; i++) {
      const userJSON = users[i].toJSON();
      if (onlineUsers[userJSON.id]) {
        userJSON.online = true;
      }
      users[i] = userJSON;
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/user-id/:id", async (req, res, next) => {
  //  for updating user conversation when recieving new sent info from another instance of account
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { id } = req.params;

    let user = await User.findOne({
      where: { id: id },
    });

    // add online status to user if online
    const userJSON = user.toJSON();
    if (onlineUsers[userJSON.id]) {
      userJSON.online = true;
    }
    user = userJSON;

    res.json([user]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
