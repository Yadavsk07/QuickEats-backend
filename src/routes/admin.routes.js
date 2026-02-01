const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.get("/dashboard", auth, role("admin"), adminController.getDashboard);
router.get("/analytics", auth, role("admin"), adminController.getAnalytics);
router.get("/orders", auth, role("admin"), adminController.getAllOrders);
router.patch("/orders/:id/status", auth, role("admin"), adminController.updateOrderStatus);
router.get("/users", auth, role("admin"), adminController.getUsers);
router.patch("/users/:id/block", auth, role("admin"), adminController.blockUser);
router.get("/menu", auth, role("admin"), adminController.getMenuItems);
router.post("/menu", auth, role("admin"), adminController.createMenuItem);
router.put("/menu/:id", auth, role("admin"), adminController.updateMenuItem);
router.patch("/menu/:id/toggle", auth, role("admin"), adminController.toggleMenuItem);

module.exports = router;
