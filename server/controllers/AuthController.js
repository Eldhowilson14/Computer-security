const User = require("../models/userModel");

module.exports.login = async (req, res, next) => {
  try {
    return res.json({ status: true, user: "user" });
  } catch (ex) {
    next(ex);
  }
};
