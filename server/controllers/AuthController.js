const FriendsList = require("../models/FriendsListModel");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("../firebase-service-account.json")
  ),
});

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, publicKey } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      publicKey,
    });
    const emptyFriendsList = await FriendsList.create({
      userId: user.id,
      friends: [],
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken, publicKey } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    let user = await User.findOne({ uid });
    if (!user) {
      const username = email.split("@")[0];
      user = await User.create({ uid, email, username, publicKey });
      const emptyFriendsList = await FriendsList.create({
        userId: user.id,
        friends: [],
      })
      
      return res.json({ status: true, user, new: true });
    }
    return res.json({ status: true, user, new: false });
  } catch (ex) {
    console.error("Error verifying ID token:", ex);
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};