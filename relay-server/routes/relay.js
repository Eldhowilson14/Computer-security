const {
  relay,
} = require("../controllers/relayController");

const router = require("express").Router();

router.post("/relay", relay);

module.exports = router;
