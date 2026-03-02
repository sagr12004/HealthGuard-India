const express = require("express");
const router = express.Router();
const { findProviders } = require("../controllers/providerController");
router.get("/", findProviders);
module.exports = router;
