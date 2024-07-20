const mongoose = require("mongoose");

const friendsListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  friends: {
    type: [String],
    default: []
  },
  reqSent: {
    type: [String],
    default: []
  },
  reqReceived: {
    type: [String],
    default: []
  },
});

module.exports = mongoose.model("FriendsList", friendsListSchema);
