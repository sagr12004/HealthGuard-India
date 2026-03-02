const express = require("express");
const router = express.Router();
const { checkSymptoms, parseSymptomText } = require("../controllers/symptomController");
router.post("/check", checkSymptoms);
router.post("/parse", parseSymptomText);
module.exports = router;
