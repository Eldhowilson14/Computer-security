const {
  login,
  googleAuth,
  logOut,
  register
} = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google-auth", googleAuth);
router.get("/logout/:id", logOut);

module.exports = router;
