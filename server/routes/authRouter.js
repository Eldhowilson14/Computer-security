const {
  login,
  googleAuth
} = require("../controllers/AuthController");

const router = require("express").Router();

router.post("/login", login);
router.post("/google-auth", googleAuth);
router.get("/logout/:id", logOut);

module.exports = router;
