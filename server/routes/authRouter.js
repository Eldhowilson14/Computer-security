const {
  login,
  googleAuth
} = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/login", login);
router.post("/google-auth", googleAuth)

module.exports = router;
