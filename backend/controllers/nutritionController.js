const axios = require("axios");
const getNutrition = async (req, res) => {
  try {
    const query = req.query.query || "oats cooked";
    const apiKey = process.env.FOODDATA_API_KEY;
    if (!apiKey || apiKey === "paste_your_key_here") return res.status(503).json({ error: "FoodData API key not configured" });
    const response = await axios.get(process.env.FOODDATA_BASE_URL + "/foods/search", {
      params: { query, pageSize: 1, api_key: apiKey }, timeout: 8000
    });
    if (!response.data.foods || response.data.foods.length === 0) return res.status(404).json({ error: "No food found" });
    const food = response.data.foods[0];
    const nutrients = food.foodNutrients || [];
    const getVal = (name) => {
      const n = nutrients.find(n => n.nutrientName && n.nutrientName.toLowerCase().includes(name.toLowerCase()));
      return n ? { value: parseFloat((n.value || 0).toFixed(2)), unit: n.unitName } : null;
    };
    res.json({ success: true, source: "USDA FoodData Central", data: {
      foodName: food.description, brandOwner: food.brandOwner || "Generic", servingSize: "100g",
      nutrients: {
        energy: getVal("energy"), protein: getVal("protein"),
        totalFat: getVal("total lipid"), carbohydrates: getVal("carbohydrate"),
        fiber: getVal("fiber"), sugars: getVal("sugars"),
        sodium: getVal("sodium"), cholesterol: getVal("cholesterol")
      }
    }});
  } catch (err) {
    console.error("Nutrition error:", err.message);
    res.status(500).json({ error: "Failed to fetch nutrition data" });
  }
};
module.exports = { getNutrition };
