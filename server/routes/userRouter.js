const { getAllUsers, setAvatar, getAllFriends } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/:userId/friends", getAllFriends);

module.exports = router;
