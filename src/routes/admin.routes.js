const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

router.post("/login", ctrl.login);
router.post("/logout", requireAdmin, ctrl.logout);
router.get("/me", requireAdmin, ctrl.me);
router.get("/stats", requireAdmin, ctrl.getDashboardStats);
router.post("/change-password", requireAdmin, ctrl.changePassword);

router.get("/admins", requireAdmin, ctrl.getAdmins);
router.post("/admins", requireAdmin, ctrl.createAdmin);
router.patch("/admins/:id", requireAdmin, ctrl.updateAdmin);
router.delete("/admins/:id", requireAdmin, ctrl.deleteAdmin);

module.exports = router;
