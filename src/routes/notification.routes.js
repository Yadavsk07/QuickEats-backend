const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/notification.controller");

router.get("/", auth, controller.getMyNotifications);
router.patch("/:id/read", auth, controller.markAsRead);

module.exports = router;
