const User = require("../models/userModel");

module.exports.relay = async (req, res, next) => {
  try {
    const { chatUserId } = req.body;
    const user = await User.findById(chatUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ hisPublicKey: user.publicKey });
  } catch (ex) {
    next(ex);
  }
};
