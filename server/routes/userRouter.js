const { getAllUsers, setAvatar, getAllFriends, getNewFriendsList, getRequestsSentList, getIncomingRequestsList, sendFriendRequest, acceptFriendRequest } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/:userId/friends", getAllFriends);
router.get("/:userId/new-friends", getNewFriendsList);
router.get("/:userId/requests-sent", getRequestsSentList);
router.get("/:userId/incoming-requests", getIncomingRequestsList);
router.post("/:userId/send-request", sendFriendRequest);
router.post("/:userId/accept-request", acceptFriendRequest);

module.exports = router;
