const { mapIndianSymptoms, extractSymptomsFromText } = require("../utils/symptomMapper");

const parseSymptomText = async (req, res) => {
  try {
    const { text, age, sex } = req.body;
    if (!text) return res.status(400).json({ error: "Symptom text is required" });
    const mappedText = mapIndianSymptoms(text);
    const extractedSymptoms = extractSymptomsFromText(text);
    const mentions = extractedSymptoms.map((s, i) => ({ id: "s_" + i, name: s, type: "symptom", choiceId: "present" }));
    res.json({ success: true, data: { originalText: text, mappedText, mentions, source: "HealthGuard India Symptom Engine" } });
  } catch (err) {
    console.error("Symptom parse error:", err.message);
    res.status(500).json({ error: "Symptom parsing failed" });
  }
};

const checkSymptoms = async (req, res) => {
  try {
    const { symptoms, age, sex, rawText } = req.body;
    let allSymptoms = symptoms || [];
    if (rawText) {
      const extracted = extractSymptomsFromText(rawText);
      const extra = extracted.map((s, i) => ({ id: "s_" + i, name: s, choiceId: "present" }));
      allSymptoms = [...allSymptoms, ...extra];
    }
    if (!allSymptoms.length) return res.status(400).json({ error: "No symptoms provided" });

    const riskSymptoms = ["chest pain", "shortness of breath", "high blood pressure", "high blood sugar"];
    const moderateSymptoms = ["fever", "vomiting", "dizziness", "diarrhea", "swelling"];
    const hasRisk = allSymptoms.some(s => riskSymptoms.includes(s.name));
    const hasModerate = allSymptoms.some(s => moderateSymptoms.includes(s.name));

    let triage;
    if (hasRisk) { triage = { level: "consultation_24", label: "See a Doctor Soon", description: "Some of your symptoms need medical attention within 24 hours." }; }
    else if (hasModerate) { triage = { level: "consultation", label: "Consult a Doctor", description: "Your symptoms suggest you should visit a doctor soon." }; }
    else { triage = { level: "self_care", label: "Home Care", description: "Your symptoms can likely be managed at home with rest and hydration." }; }

    const conditionMap = {
      "headache": [{ name: "Tension Headache", probability: 65 }, { name: "Migraine", probability: 30 }],
      "fever": [{ name: "Viral Infection", probability: 70 }, { name: "Bacterial Infection", probability: 25 }],
      "chest pain": [{ name: "Cardiac Issue", probability: 45 }, { name: "Acid Reflux", probability: 35 }, { name: "Muscle Strain", probability: 20 }],
      "stomach pain": [{ name: "Gastritis", probability: 55 }, { name: "Irritable Bowel Syndrome", probability: 30 }],
      "high blood sugar": [{ name: "Diabetes Type 2", probability: 70 }, { name: "Pre-diabetes", probability: 25 }],
      "high blood pressure": [{ name: "Hypertension", probability: 75 }, { name: "White Coat Hypertension", probability: 20 }],
      "cough": [{ name: "Viral Upper Respiratory Infection", probability: 60 }, { name: "Allergic Rhinitis", probability: 30 }],
      "dizziness": [{ name: "Vertigo", probability: 50 }, { name: "Low Blood Pressure", probability: 35 }],
      "weakness": [{ name: "Anemia", probability: 45 }, { name: "Vitamin Deficiency", probability: 40 }],
      "shortness of breath": [{ name: "Asthma", probability: 50 }, { name: "Cardiac Issue", probability: 35 }]
    };

    const diagnosisMap = {};
    allSymptoms.forEach(s => {
      const conditions = conditionMap[s.name] || [];
      conditions.forEach(c => {
        if (!diagnosisMap[c.name]) diagnosisMap[c.name] = 0;
        diagnosisMap[c.name] = Math.max(diagnosisMap[c.name], c.probability);
      });
    });

    const diagnosis = Object.entries(diagnosisMap)
      .map(([name, probability]) => ({ name, commonName: name, probability }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    res.json({ success: true, data: { diagnosis, triage, symptomsAnalyzed: allSymptoms.map(s => s.name) } });
  } catch (err) {
    console.error("Symptom check error:", err.message);
    res.status(500).json({ error: "Symptom check failed" });
  }
};

module.exports = { checkSymptoms, parseSymptomText };
