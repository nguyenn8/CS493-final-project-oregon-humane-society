const router = require("express").Router();

router.use("/animals", require("./animals"));
router.use("/employees", require("./employees"));
router.use("/locations", require("./locations"));
router.use("/services", require("./services"));
router.use("/photos", require("./photos"));

module.exports = router;
