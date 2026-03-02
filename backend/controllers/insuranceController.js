const axios = require("axios");
const getInsuranceInfo = async (req, res) => {
  try {
    const response = await axios.get(process.env.HEALTHCARE_GOV_BASE_URL + "/glossary.json", { timeout: 8000 });
    const glossary = response.data.glossary || [];
    const terms = glossary.slice(0, 10).map(item => ({ title: item.title, url: "https://www.healthcare.gov" + item.url }));
    res.json({ success: true, data: { terms, source: "Healthcare.gov" } });
  } catch (err) {
    console.error("Insurance error:", err.message);
    res.status(500).json({ error: "Failed to fetch insurance info" });
  }
};
module.exports = { getInsuranceInfo };
