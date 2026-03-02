const express = require("express");
const router = express.Router();
const { getGlobalStats, getCountryStats } = require("../controllers/diseaseController");
router.get("/global", getGlobalStats);
router.get("/country/:country", getCountryStats);
module.exports = router;
