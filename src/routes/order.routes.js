const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/order.controller");

/* CUSTOMER */
router.post("/", auth, controller.createOrder);
router.get("/my-orders", auth, controller.getMyOrders);
router.get("/:id", auth, controller.getOrderById);

/* ADMIN */
router.get("/", auth, role("admin"), controller.getAllOrders);
router.patch("/:id/status", auth, role("admin"), controller.updateOrderStatus);

module.exports = router;
