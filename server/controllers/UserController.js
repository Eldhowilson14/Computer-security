const User = require("../models/UserModel");
const FriendsList = require("../models/FriendsListModel");

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const friendsList = await FriendsList.findOne({ userId });
    const users = await User.find({
      _id: { $in: friendsList.friends.map((userId) => Object(userId)) },
    }).select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getNewFriendsList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const friendsList = await FriendsList.findOne({ userId });
    const users = await User.find({
      _id: {
        $nin: [
          ...friendsList.friends.map((userId) => Object(userId)),
          ...friendsList.reqSent.map((userId) => Object(userId)),
          ...friendsList.reqReceived.map((userId) => Object(userId)),
          Object(userId),
        ],
      },
    }).select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getRequestsSentList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const friendsList = await FriendsList.findOne({ userId });
    const users = await User.find({
      _id: { $in: [...friendsList.reqSent.map((userId) => Object(userId))] },
    }).select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getIncomingRequestsList = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const friendsList = await FriendsList.findOne({ userId });
    const users = await User.find({
      _id: {
        $in: [...friendsList.reqReceived.map((userId) => Object(userId))],
      },
    }).select(["email", "username", "avatarImage", "_id"]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.body;
    const friend = await User.findOne({ _id: friendId });
    if (!friend)
      return res.json({ msg: `User with id ${friendId} not exist`, status: false });
    
    // update sent request for sender
    await FriendsList.findOneAndUpdate(
      // dont update if req already sent: wont happen in real time implementation
      { userId, reqSent: { $nin: [friendId] } },
      { $push: { reqSent: friendId } },
    )
    
    // update incoming request for receiver
    await FriendsList.findOneAndUpdate(
      { userId: friendId, reqReceived: { $nin: [userId] } },
      { $push: { reqReceived: userId } },
    )

    return res.json({ status: true });
  } catch (ex) {
    next(ex);
  }
};