const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.createPost = async (req, res) => {
  const { text = "", imageUrl = "" } = req.body;
  if (!text.trim() && !imageUrl.trim()) {
    return res.status(400).json({ message: "A post must include text or an imageUrl." });
  }
  const post = await Post.create({ author: req.user._id, text, imageUrl });
  await post.populate("author", "name username avatar");
  res.status(201).json({ post });
};

exports.getFeed = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const followingIds = req.user.following.map((id) => id.toString());
  followingIds.push(req.user.id);
  const [posts, total] = await Promise.all([
    Post.find({ author: { $in: followingIds } })
      .populate("author", "name username avatar")
      .populate({ path: "comments", populate: { path: "author", select: "name username avatar" } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments({ author: { $in: followingIds } })
  ]);
  res.json({ posts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name username avatar")
    .populate({ path: "comments", populate: { path: "author", select: "name username avatar" } });
  if (!post) return res.status(404).json({ message: "Post not found." });
  res.json({ post });
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  if (!post.author.equals(req.user._id)) return res.status(403).json({ message: "You can only edit your own posts." });
  const { text, imageUrl } = req.body;
  if (text !== undefined) post.text = text;
  if (imageUrl !== undefined) post.imageUrl = imageUrl;
  if (!post.text.trim() && !post.imageUrl.trim()) return res.status(400).json({ message: "A post must include text or an imageUrl." });
  await post.save();
  await post.populate("author", "name username avatar");
  res.json({ post });
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  if (!post.author.equals(req.user._id)) return res.status(403).json({ message: "You can only delete your own posts." });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: "Post deleted." });
};

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  const liked = post.likes.some((id) => id.equals(req.user._id));
  if (liked) post.likes = post.likes.filter((id) => !id.equals(req.user._id));
  else post.likes.push(req.user._id);
  await post.save();
  res.json({ liked: !liked, likesCount: post.likes.length });
};

exports.addComment = async (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ message: "Comment text is required." });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  const comment = await Comment.create({ post: post._id, author: req.user._id, text });
  post.comments.push(comment._id);
  await post.save();
  await comment.populate("author", "name username avatar");
  res.status(201).json({ comment });
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found." });
  if (!comment.author.equals(req.user._id)) return res.status(403).json({ message: "You can only delete your own comments." });
  await Post.updateOne({ _id: comment.post }, { $pull: { comments: comment._id } });
  await comment.deleteOne();
  res.json({ message: "Comment deleted." });
};