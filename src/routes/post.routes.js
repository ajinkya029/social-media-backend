const router = require("express").Router();
const controller = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get("/feed", controller.getFeed);
router.post("/", controller.createPost);
router.get("/:id", controller.getPost);
router.patch("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);
router.post("/:id/like", controller.toggleLike);

module.exports = router;