const express = require("express");
const router = express.Router();
const { getDrugInfo } = require("../controllers/drugController");
router.get("/", getDrugInfo);
module.exports = router;
