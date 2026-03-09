const express = require("express");
const router = express.Router();
const { assessRisk } = require("../controllers/riskController");
router.post("/", assessRisk);
module.exports = router;