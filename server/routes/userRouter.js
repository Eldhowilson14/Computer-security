const { getAllUsers } = require("../controllers/UserController");

const router = require("express").Router();

router.get("/allusers/:id", getAllUsers);

module.exports = router;
