const express = require("express");
const router = express.Router();
const { getNutrition } = require("../controllers/nutritionController");
router.get("/", getNutrition);
module.exports = router;
