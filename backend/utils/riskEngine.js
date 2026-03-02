const calculateRisk = (input) => {
  const { age, height, weight, bp, glucose, familyHistory, smoking, activity } = input;
  const heightM = height / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(2));
  let bmiCategory;
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";
  const MAX_SCORE = 18;
  const factors = [];
  let score = 0;
  if (age > 45) { score += 2; factors.push({ factor: "Age > 45", points: 2, isRisk: true }); }
  else { factors.push({ factor: "Age 45 or under", points: 0, isRisk: false }); }
  if (bmi >= 30) { score += 3; factors.push({ factor: "BMI Obese (>=30)", points: 3, isRisk: true }); }
  else if (bmi >= 25) { score += 1; factors.push({ factor: "BMI Overweight (25-29.9)", points: 1, isRisk: true }); }
  else { factors.push({ factor: "BMI Normal", points: 0, isRisk: false }); }
  if (bp > 140) { score += 3; factors.push({ factor: "High BP (>140 mmHg)", points: 3, isRisk: true }); }
  else if (bp > 120) { score += 1; factors.push({ factor: "Elevated BP (120-140)", points: 1, isRisk: true }); }
  else { factors.push({ factor: "Normal Blood Pressure", points: 0, isRisk: false }); }
  if (glucose > 126) { score += 4; factors.push({ factor: "High Glucose (>126 mg/dL)", points: 4, isRisk: true }); }
  else if (glucose > 100) { score += 2; factors.push({ factor: "Pre-diabetic Glucose (100-126)", points: 2, isRisk: true }); }
  else { factors.push({ factor: "Normal Blood Sugar", points: 0, isRisk: false }); }
  if (familyHistory) { score += 2; factors.push({ factor: "Family History Present", points: 2, isRisk: true }); }
  else { factors.push({ factor: "No Family History", points: 0, isRisk: false }); }
  if (activity === "sedentary") { score += 2; factors.push({ factor: "Sedentary Lifestyle", points: 2, isRisk: true }); }
  else if (activity === "light") { score += 1; factors.push({ factor: "Light Activity Only", points: 1, isRisk: true }); }
  else { factors.push({ factor: "Active (" + activity + ")", points: 0, isRisk: false }); }
  if (smoking) { score += 2; factors.push({ factor: "Smoker", points: 2, isRisk: true }); }
  else { factors.push({ factor: "Non-smoker", points: 0, isRisk: false }); }
  const riskPercentage = Math.min(100, Math.round((score / MAX_SCORE) * 100));
  let riskLevel;
  if (riskPercentage <= 30) riskLevel = "Low";
  else if (riskPercentage <= 60) riskLevel = "Moderate";
  else riskLevel = "High";
  const riskFactorNames = factors.filter(f => f.isRisk).map(f => f.factor);
  const explanation = riskFactorNames.length === 0 ? "No major risk factors identified." : "Elevated risk due to: " + riskFactorNames.join("; ") + ".";
  const recommendations = buildRecommendations({ bmi, bp, glucose, age, activity, smoking, familyHistory });
  return { bmi, bmiCategory, score, maxScore: MAX_SCORE, riskPercentage, riskLevel, explanation, factors, recommendations, needsNutrition: bmi > 25, computedAt: new Date().toISOString() };
};
const buildRecommendations = ({ bmi, bp, glucose, age, activity, smoking, familyHistory }) => {
  const recs = [];
  if (bmi >= 30) recs.push({ priority: "High", icon: "???", category: "Weight", text: "BMI indicates obesity. Aim for 500-750 kcal/day deficit with supervised diet and 150+ min/week exercise." });
  else if (bmi >= 25) recs.push({ priority: "Medium", icon: "??", category: "Weight", text: "BMI slightly elevated. A balanced caloric deficit and increased activity can help." });
  if (bp > 140) recs.push({ priority: "High", icon: "??", category: "Blood Pressure", text: "Hypertension Stage 2. Consult a physician immediately. Reduce salt to under 1500mg/day." });
  else if (bp > 120) recs.push({ priority: "Medium", icon: "??", category: "Blood Pressure", text: "Pre-hypertension. Reduce sodium to under 2300mg/day. Try the DASH diet." });
  if (glucose > 126) recs.push({ priority: "High", icon: "??", category: "Blood Sugar", text: "Fasting glucose in diabetic range. Schedule an HbA1c test immediately." });
  else if (glucose > 100) recs.push({ priority: "Medium", icon: "??", category: "Blood Sugar", text: "Pre-diabetic range. Reduce refined carbs and increase fiber intake." });
  if (smoking) recs.push({ priority: "High", icon: "??", category: "Smoking", text: "Smoking doubles cardiovascular risk. Consider NRT patches or counseling." });
  if (activity === "sedentary") recs.push({ priority: "High", icon: "??", category: "Activity", text: "Sedentary lifestyle is a major risk factor. Start with 10-min walks after each meal." });
  else if (activity === "light") recs.push({ priority: "Medium", icon: "??", category: "Activity", text: "Increase to at least 150 minutes of moderate exercise per week." });
  if (age > 45) recs.push({ priority: "Low", icon: "??", category: "Screening", text: "Annual screenings critical after 45. Get lipid panel and HbA1c yearly." });
  if (familyHistory) recs.push({ priority: "Medium", icon: "??", category: "Genetics", text: "Family history raises baseline risk. More frequent monitoring recommended." });
  if (recs.length === 0) recs.push({ priority: "Low", icon: "?", category: "General", text: "Risk profile looks favorable. Maintain healthy habits and get annual check-ups." });
  return recs;
};
module.exports = { calculateRisk };
