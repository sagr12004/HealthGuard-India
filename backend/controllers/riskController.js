const { calculateRisk } = require("../utils/riskEngine");
const assessRisk = (req, res) => {
  try {
    const { age, gender, height, weight, bp, glucose, familyHistory, smoking, activity } = req.body;
    const required = { age, height, weight, bp, glucose };
    for (const [key, val] of Object.entries(required)) {
      if (val === undefined || val === null || val === "") return res.status(400).json({ error: "Missing required field: " + key });
      if (isNaN(Number(val))) return res.status(400).json({ error: "Invalid value for: " + key });
    }
    const input = {
      age: Number(age), gender: gender || "not specified",
      height: Number(height), weight: Number(weight),
      bp: Number(bp), glucose: Number(glucose),
      familyHistory: familyHistory === "yes" || familyHistory === true,
      smoking: smoking === "yes" || smoking === true,
      activity: activity || "sedentary"
    };
    if (input.age < 18 || input.age > 120) return res.status(400).json({ error: "Age must be between 18 and 120" });
    if (input.height < 100 || input.height > 250) return res.status(400).json({ error: "Height must be between 100 and 250 cm" });
    if (input.weight < 20 || input.weight > 300) return res.status(400).json({ error: "Weight must be between 20 and 300 kg" });
    if (input.bp < 60 || input.bp > 250) return res.status(400).json({ error: "Blood pressure out of range" });
    if (input.glucose < 40 || input.glucose > 600) return res.status(400).json({ error: "Glucose out of range" });
    const result = calculateRisk(input);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Risk error:", err.message);
    return res.status(500).json({ error: "Risk calculation failed" });
  }
};
module.exports = { assessRisk };
