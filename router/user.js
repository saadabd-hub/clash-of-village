const router = require("express").Router();
const userController = require("../controller/user-controller");
const authentication = require("../middleware/authentication");

router.post("/register", userController.register);
router.get("/:id", userController.details);
router.post("/login", userController.login);

module.exports = router;