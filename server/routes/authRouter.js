const {
  login,
} = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/login", login);

module.exports = router;
