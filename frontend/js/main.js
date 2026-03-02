var featureFlags = { symptoms: true, medicine: true, hospital: true, nutrition: true, disease: true };

function toggleFeature(name, checkbox) {
  featureFlags[name] = checkbox.checked;
  var section = document.getElementById("section-" + name);
  if (section) section.style.display = checkbox.checked ? "block" : "none";
  var label = checkbox.closest(".feature-toggle");
  if (label) label.classList.toggle("checked", checkbox.checked);
}

// Toggle button groups (family history, smoking, activity)
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".toggle-group").forEach(function(group) {
    group.querySelectorAll(".toggle-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        group.querySelectorAll(".toggle-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
      });
    });
  });

  // Symptom tag suggestions
  var symInput = document.getElementById("symptomText");
  var symTags  = document.getElementById("symptomTags");
  var suggestions = ["headache","fever","chest pain","stomach ache","dizziness","fatigue","cough","back pain","nausea","shortness of breath","sinus","migraine","weakness","vomiting","sore throat"];

  if (symTags) {
    suggestions.forEach(function(s) {
      var tag = document.createElement("button");
      tag.className = "sym-tag";
      tag.textContent = s;
      tag.onclick = function() {
        var cur = symInput.value.trim();
        symInput.value = cur ? cur + ", " + s : s;
        tag.classList.toggle("selected");
      };
      symTags.appendChild(tag);
    });
  }

  // Submit button
  var submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", handleSubmit);
});

async function handleSubmit() {
  var age      = document.getElementById("age").value;
  var gender   = document.getElementById("gender").value;
  var height   = document.getElementById("height").value;
  var weight   = document.getElementById("weight").value;
  var bp       = document.getElementById("bp").value;
  var glucose  = document.getElementById("glucose").value;
  var errEl    = document.getElementById("formError");

  if (!age || !height || !weight || !bp || !glucose) {
    errEl.style.display = "block";
    errEl.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  errEl.style.display = "none";

  var familyBtn   = document.querySelector("#familyHistory .toggle-btn.active");
  var smokingBtn  = document.querySelector("#smoking .toggle-btn.active");
  var activityBtn = document.querySelector("#activity .toggle-btn.active");
  var familyHistory = familyBtn  ? familyBtn.dataset.value  : "no";
  var smoking       = smokingBtn ? smokingBtn.dataset.value : "no";
  var activity      = activityBtn? activityBtn.dataset.value: "sedentary";

  var symptomText = document.getElementById("symptomText") ? document.getElementById("symptomText").value : "";
  var medication  = document.getElementById("medication")  ? document.getElementById("medication").value  : "";
  var cityInput   = document.getElementById("cityInput")   ? document.getElementById("cityInput").value   : "";
  var specialty   = document.getElementById("providerSpecialty") ? document.getElementById("providerSpecialty").value : "general";

  var overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.add("show");

  try {
    // 1. Risk assessment (required)
    var riskRes = await fetchRiskAssessment({ age, height, weight, bp, glucose, familyHistory, smoking, activity });
    var result  = riskRes.data;

    // 2. Nutrition (optional)
    var nutritionData = null;
    if (featureFlags.nutrition && result.needsNutrition) {
      try {
        var food = result.riskLevel === "High" ? "brown rice" : "white rice";
        nutritionData = (await fetchNutrition(food)).data;
      } catch(e) { console.warn("Nutrition:", e.message); }
    }

    // 3. Drug info (optional)
    var drugData = null;
    if (featureFlags.medicine && medication) {
      try { drugData = (await fetchDrugData(medication)).data; }
      catch(e) { console.warn("Drug:", e.message); }
    }

    // 4. Symptoms (optional)
    var symptomResult = null;
    if (featureFlags.symptoms && symptomText) {
      try {
        var parsed   = await parseSymptoms(symptomText, Number(age), gender || "male");
        var mentions = (parsed.data && parsed.data.mentions) || [];
        symptomResult = (await checkSymptoms(mentions, Number(age), gender || "male", symptomText)).data;
      } catch(e) { console.warn("Symptoms:", e.message); }
    }

    // 5. Providers (optional)
    var providerData = null;
    if (featureFlags.hospital && cityInput) {
      try { providerData = (await fetchProviders(cityInput, specialty)).data; }
      catch(e) { console.warn("Providers:", e.message); }
    }

    // 6. Disease stats (optional)
    var diseaseStats = null;
    if (featureFlags.disease) {
      try { diseaseStats = (await fetchDiseaseStats("covid")).data; }
      catch(e) { console.warn("Disease:", e.message); }
    }

    if (overlay) overlay.classList.remove("show");

    // Save and navigate
    var payload = {
      result, nutritionData, drugData, symptomResult, providerData, diseaseStats,
      medication,
      flags: { showNutrition: featureFlags.nutrition, showDisease: featureFlags.disease }
    };
    sessionStorage.setItem("hg_results", JSON.stringify(payload));
    window.location.href = "results.html";

  } catch(err) {
    if (overlay) overlay.classList.remove("show");
    alert("Error: " + err.message + "\n\nMake sure backend is running:\ncd HealthGuard && node server.js");
  }
}