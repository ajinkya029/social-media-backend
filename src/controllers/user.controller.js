const User = require("../models/User");
const Post = require("../models/Post");

exports.getProfile = async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select("-email")
    .populate("followers", "name username avatar")
    .populate("following", "name username avatar");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const allowed = ["name", "bio", "avatar", "website"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ user: req.user });
};

exports.followUser = async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: "You cannot follow yourself." });
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found." });

  const alreadyFollowing = req.user.following.some((id) => id.equals(target._id));
  if (alreadyFollowing) {
    req.user.following = req.user.following.filter((id) => !id.equals(target._id));
    target.followers = target.followers.filter((id) => !id.equals(req.user._id));
  } else {
    req.user.following.push(target._id);
    target.followers.push(req.user._id);
  }
  await Promise.all([req.user.save(), target.save()]);
  res.json({ following: !alreadyFollowing, userId: target._id });
};

exports.getUserPosts = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: "User not found." });
  const posts = await Post.find({ author: user._id })
    .populate("author", "name username avatar")
    .populate({ path: "comments", populate: { path: "author", select: "name username avatar" } })
    .sort({ createdAt: -1 });
  res.json({ posts });
};

exports.searchUsers = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [] });
  const users = await User.find({
    $or: [
      { username: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      { name: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    ]
  }).select("name username avatar bio").limit(20);
  res.json({ users });
};