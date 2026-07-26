const router = require("express").Router();
const controller = require("../controllers/review.controller");
const { upload } = require("../middleware/upload.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createReviewRules, paginationRules } = require("../validation/review.validation");
const { requireAdmin } = require("../middleware/auth.middleware");

router.get("/stats", controller.stats);
router.get("/", paginationRules, validate, controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/images/:index", controller.getImage);

router.post("/", upload.array("images", 5), createReviewRules, validate, controller.create);

// Admin-protected routes
router.patch("/:id", requireAdmin, controller.update);
router.patch("/:id/helpful", controller.helpful);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
