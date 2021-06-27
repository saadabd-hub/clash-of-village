const router = require("express").Router();
const userRoute = require("./user");
const marketRoute = require("./market");
const authentication = require("../middleware/authentication");
const errorHandler = require("../middleware/errorHandler");

router.get("/", (req, res)=>{
    res.send("Clash of Village");
});
router.use("/user", userRoute);
router.use(authentication);
router.use("/market", marketRoute);
router.use(errorHandler);

module.exports = router;
