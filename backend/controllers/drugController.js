const axios = require("axios");
const getDrugInfo = async (req, res) => {
  try {
    const medName = req.query.name && req.query.name.trim();
    if (!medName) return res.status(400).json({ error: "Medication name is required" });
    const base = process.env.OPENFDA_BASE_URL || "https://api.fda.gov";
    const apiKey = process.env.OPENFDA_API_KEY;
    const keyParam = apiKey && apiKey !== "paste_your_key_here" ? "&api_key=" + apiKey : "";
    let data = null;
    const queries = ["openfda.generic_name:\"" + medName + "\"", "openfda.brand_name:\"" + medName + "\""];
    for (const q of queries) {
      try {
        const response = await axios.get(base + "/drug/label.json?search=" + encodeURIComponent(q) + "&limit=1" + keyParam, { timeout: 8000 });
        if (response.data.results && response.data.results.length > 0) { data = response.data.results[0]; break; }
      } catch (e) { continue; }
    }
    if (!data) return res.status(404).json({ error: "No FDA data found for " + medName });
    res.json({ success: true, data: {
      drugName: (data.openfda && data.openfda.generic_name && data.openfda.generic_name[0]) || medName,
      brandName: (data.openfda && data.openfda.brand_name && data.openfda.brand_name[0]) || null,
      manufacturer: (data.openfda && data.openfda.manufacturer_name && data.openfda.manufacturer_name[0]) || null,
      drugClass: (data.openfda && data.openfda.pharm_class_epc && data.openfda.pharm_class_epc[0]) || null,
      indications: (data.indications_and_usage && data.indications_and_usage[0]) || null,
      warnings: (data.warnings && data.warnings[0]) || null,
      dosage: (data.dosage_and_administration && data.dosage_and_administration[0]) || null,
      adverseReactions: (data.adverse_reactions && data.adverse_reactions[0]) || null,
      contraindications: (data.contraindications && data.contraindications[0]) || null
    }});
  } catch (err) {
    console.error("Drug error:", err.message);
    res.status(500).json({ error: "Failed to fetch drug info" });
  }
};
module.exports = { getDrugInfo };
