const router = require("express").Router();
const ctrl = require("../controllers/oil.controller");
const { upload } = require("../middleware/upload.middleware");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public
router.get("/", ctrl.getAll);
router.get("/:id/image", ctrl.getImage);
router.get("/:id", ctrl.getById);

// Admin protected
router.post("/", requireAdmin, upload.single("image"), ctrl.create);
router.patch("/:id", requireAdmin, upload.single("image"), ctrl.update);
router.delete("/:id", requireAdmin, ctrl.remove);

module.exports = router;
