const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: function () {
      return !this.uid;
    },
    min: 8,
  },
  uid: {
    type: String,
    unique: true,
    sparse: true,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  publicKey: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
