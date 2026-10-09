const router = require("express").Router();
const controller = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:id/comments", protect, controller.addComment);
router.delete("/:id/comments/:commentId", protect, controller.deleteComment);

module.exports = router;