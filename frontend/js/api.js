const API_BASE = "http://localhost:5000/api";
async function fetchRiskAssessment(payload) {
  const res = await fetch(API_BASE + "/risk/assess", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Risk assessment failed");
  return data;
}
async function fetchNutritionData(query, source) {
  const res = await fetch(API_BASE + "/nutrition?query=" + encodeURIComponent(query||"oats cooked") + "&source=" + (source||"fooddata"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Nutrition fetch failed");
  return data;
}
async function fetchDrugData(medName) {
  const res = await fetch(API_BASE + "/drug?name=" + encodeURIComponent(medName));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Drug fetch failed");
  return data;
}
async function parseSymptoms(text, age, sex) {
  const res = await fetch(API_BASE + "/symptom/parse", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({text,age,sex}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Symptom parse failed");
  return data;
}
async function checkSymptoms(symptoms, age, sex, rawText) {
  const res = await fetch(API_BASE + "/symptom/check", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({symptoms,age,sex,rawText}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Symptom check failed");
  return data;
}
async function findProviders(city, specialty) {
  const res = await fetch(API_BASE + "/provider?city=" + encodeURIComponent(city||"") + "&specialty=" + encodeURIComponent(specialty||"general"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Provider search failed");
  return data;
}
async function fetchDiseaseStats(country) {
  const url = country ? API_BASE + "/disease/country/" + encodeURIComponent(country) : API_BASE + "/disease/global";
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Disease stats failed");
  return data;
}
