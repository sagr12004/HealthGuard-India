const axios = require("axios");
const getGlobalStats = async (req, res) => {
  try {
    const response = await axios.get(process.env.OPEN_DISEASE_BASE_URL + "/all", { timeout: 8000 });
    const d = response.data;
    res.json({ success: true, data: { covid: { cases: d.cases, deaths: d.deaths, recovered: d.recovered, active: d.active, todayCases: d.todayCases, todayDeaths: d.todayDeaths, updated: d.updated } } });
  } catch (err) {
    console.error("Disease error:", err.message);
    res.status(500).json({ error: "Failed to fetch disease stats" });
  }
};
const getCountryStats = async (req, res) => {
  try {
    const response = await axios.get(process.env.OPEN_DISEASE_BASE_URL + "/countries/" + encodeURIComponent(req.params.country), { timeout: 8000 });
    const d = response.data;
    res.json({ success: true, data: { country: d.country, cases: d.cases, deaths: d.deaths, recovered: d.recovered, active: d.active, todayCases: d.todayCases, population: d.population, updated: d.updated } });
  } catch (err) {
    console.error("Country error:", err.message);
    res.status(500).json({ error: "Failed to fetch country data" });
  }
};
module.exports = { getGlobalStats, getCountryStats };
