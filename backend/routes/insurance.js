const express = require("express");
const router = express.Router();
const { getInsuranceInfo } = require("../controllers/insuranceController");
router.get("/", getInsuranceInfo);
module.exports = router;
