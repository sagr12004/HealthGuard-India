const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 150 });
app.use("/api/", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const riskRoutes      = require("./routes/risk");
const nutritionRoutes = require("./routes/nutrition");
const drugRoutes      = require("./routes/drug");
const symptomRoutes   = require("./routes/symptom");
const providerRoutes  = require("./routes/provider");
const diseaseRoutes   = require("./routes/disease");
const insuranceRoutes = require("./routes/insurance");

app.use("/api/risk",      riskRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/drug",      drugRoutes);
app.use("/api/symptom",   symptomRoutes);
app.use("/api/provider",  providerRoutes);
app.use("/api/disease",   diseaseRoutes);
app.use("/api/insurance", insuranceRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "HealthGuard API v2 is running",
    timestamp: new Date().toISOString(),
    apis: {
      fooddata:    process.env.FOODDATA_API_KEY    && process.env.FOODDATA_API_KEY    !== "paste_your_key_here" ? "Loaded" : "Missing",
      openfda:     process.env.OPENFDA_API_KEY     && process.env.OPENFDA_API_KEY     !== "paste_your_key_here" ? "Loaded" : "Missing",
      nutritionix: process.env.NUTRITIONIX_API_KEY && process.env.NUTRITIONIX_API_KEY !== "paste_your_key_here" ? "Loaded" : "Missing",
      infermedica: process.env.INFERMEDICA_API_KEY && process.env.INFERMEDICA_API_KEY !== "paste_your_key_here" ? "Loaded" : "Missing",
      nppes:       "No key needed",
      openDisease: "No key needed",
      healthcare:  "No key needed"
    }
  });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => { console.error("Error:", err.message); res.status(500).json({ error: "Internal server error" }); });

app.listen(PORT, () => {
  console.log("\n HealthGuard Backend v2 running on http://localhost:" + PORT);
  console.log(" Environment : " + (process.env.NODE_ENV || "development"));
  console.log(" FoodData    : " + (process.env.FOODDATA_API_KEY    && process.env.FOODDATA_API_KEY    !== "paste_your_key_here" ? "Loaded" : "Missing"));
  console.log(" openFDA     : " + (process.env.OPENFDA_API_KEY     && process.env.OPENFDA_API_KEY     !== "paste_your_key_here" ? "Loaded" : "Missing"));
  console.log(" Nutritionix : " + (process.env.NUTRITIONIX_API_KEY && process.env.NUTRITIONIX_API_KEY !== "paste_your_key_here" ? "Loaded" : "Missing"));
  console.log(" Infermedica : " + (process.env.INFERMEDICA_API_KEY && process.env.INFERMEDICA_API_KEY !== "paste_your_key_here" ? "Loaded" : "Missing"));
});
