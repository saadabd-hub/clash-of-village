const router = require('express').Router();
const barrackController = require("../controller/barrack-controller");
const { barrackAuthorize } = require("../middleware/authorization");

router.get("/", barrackController.details);
router.post("/", barrackController.create);
router.get("/:id", barrackAuthorize, barrackController.getById);
router.put("/:id", barrackAuthorize, barrackController.update);
router.delete("/:id", barrackAuthorize, barrackController.delete);
router.get("/:id/collect", barrackAuthorize, barrackController.collect);

module.exports = router;