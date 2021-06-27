const router = require('express').Router();
const marketController = require("../controller/market-controller");
const { marketAuthorize } = require("../middleware/authorization");

router.get("/", marketController.details);
router.post("/", marketController.create);
router.get("/:id", marketAuthorize, marketController.detailById);
router.put("/:id", marketAuthorize, marketController.update);
router.delete("/:id", marketAuthorize, marketController.delete);
router.get("/:id/collect", marketAuthorize, marketController.collect);

module.exports = router;
