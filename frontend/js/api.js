var API_BASE = "https://healthguard-india.onrender.com/api";

async function fetchRiskAssessment(data) {
  var res = await fetch(API_BASE + "/risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Risk API failed: " + res.status);
  return await res.json();
}

async function fetchNutrition(food) {
  var res = await fetch(API_BASE + "/nutrition?food=" + encodeURIComponent(food));
  if (!res.ok) throw new Error("Nutrition API failed");
  return await res.json();
}

async function fetchDrugData(medicine) {
  var res = await fetch(API_BASE + "/drug?medicine=" + encodeURIComponent(medicine));
  if (!res.ok) throw new Error("Drug API failed");
  return await res.json();
}

async function parseSymptoms(text, age, gender) {
  var res = await fetch(API_BASE + "/symptom/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text, age: age, gender: gender })
  });
  if (!res.ok) throw new Error("Symptom parse failed");
  return await res.json();
}

async function checkSymptoms(mentions, age, gender, text) {
  var res = await fetch(API_BASE + "/symptom/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mentions: mentions, age: age, gender: gender, text: text })
  });
  if (!res.ok) throw new Error("Symptom check failed");
  return await res.json();
}

async function fetchProviders(city, specialty) {
  var res = await fetch(API_BASE + "/provider?city=" + encodeURIComponent(city) + "&specialty=" + encodeURIComponent(specialty));
  if (!res.ok) throw new Error("Provider API failed");
  return await res.json();
}

async function fetchDiseaseStats(disease) {
  var res = await fetch(API_BASE + "/disease?name=" + encodeURIComponent(disease || "covid"));
  if (!res.ok) throw new Error("Disease API failed");
  return await res.json();
}

async function fetchInsurance(age, conditions) {
  var res = await fetch(API_BASE + "/insurance?age=" + age + "&conditions=" + encodeURIComponent(conditions || ""));
  if (!res.ok) throw new Error("Insurance API failed");
  return await res.json();
}
