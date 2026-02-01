const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/menu.controller");

/* CATEGORY */
router.post("/categories", auth, role("admin"), controller.createCategory);
router.get("/categories", controller.getCategories);

/* MENU ITEMS */
router.post("/", auth, role("admin"), controller.createMenuItem);
router.get("/", controller.getMenuItems);
router.put("/:id", auth, role("admin"), controller.updateMenuItem);
router.patch("/:id/toggle", auth, role("admin"), controller.toggleAvailability);

module.exports = router;
