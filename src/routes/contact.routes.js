const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public
router.get("/", ctrl.get);

// Admin protected
router.put("/", requireAdmin, ctrl.update);

module.exports = router;
