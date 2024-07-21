const { getMessages } = require("../controllers/MessageController");

const router = require("express").Router();

router.post("/getmsg/", getMessages);

module.exports = router;
