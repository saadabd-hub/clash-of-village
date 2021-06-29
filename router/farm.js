const router = require('express').Router();
const farmController = require("../controller/farm-controller");
const { farmAuthorize } = require("../middleware/authorization");

router.get("/", farmController.details);
router.post("/", farmController.create);
router.get("/:id", farmAuthorize, farmController.detailById);
router.put("/:id", farmAuthorize, farmController.update);
router.delete("/:id", farmAuthorize, farmController.delete);
router.get("/:id/collect", farmAuthorize, farmController.collect);

module.exports = router;