const router = require("express").Router();
const controller = require("../controllers/password.controller");

router.post("/request-reset", controller.requestReset);
router.post("/verify-otp", controller.verifyResetOtp);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
