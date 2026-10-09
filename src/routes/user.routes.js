const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/search", protect, controller.searchUsers);
router.get("/:username/posts", protect, controller.getUserPosts);
router.get("/:username", protect, controller.getProfile);
router.patch("/me/profile", protect, controller.updateProfile);
router.post("/:id/follow", protect, controller.followUser);

module.exports = router;