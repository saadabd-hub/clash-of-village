const router = require("express").Router();
const attackController = require('../controller/attack-controller');

router.post("/:id", attackController.attack);

module.exports = router;
