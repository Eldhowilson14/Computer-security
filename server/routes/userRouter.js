const { getAllUsers, setAvatar, getAllFriends, getNewFriendsList } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/:userId/friends", getAllFriends);
router.get("/:userId/new-friends", getNewFriendsList);

module.exports = router;
