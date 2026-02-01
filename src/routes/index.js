const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/menu", require("./menu.routes"));
router.use("/orders", require("./order.routes"));

module.exports = router;
