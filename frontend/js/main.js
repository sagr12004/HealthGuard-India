document.querySelectorAll(".toggle-group").forEach(function(group) {
  group.querySelectorAll(".toggle-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      group.querySelectorAll(".toggle-btn").forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
    });
  });
});

function getToggle(id) {
  var a = document.querySelector("#" + id + " .toggle-btn.active");
  return a ? a.dataset.value : null;
}

function toggleFeature(feature, checkbox) {
  var section = document.getElementById("section-" + feature);
  var label = document.getElementById("toggle-" + feature);
  if (section) section.style.display = checkbox.checked ? "block" : "none";
  if (label) { if (checkbox.checked) label.classList.add("checked"); else label.classList.remove("checked"); }
}

document.getElementById("submitBtn").addEventListener("click", runAssessment);

var parsedSymptoms = [];
var parseTimer = null;
var featureFlags = { symptoms: true, medicine: true, hospital: true, nutrition: true, disease: true };

var symptomInput = document.getElementById("symptomText");
if (symptomInput) {
  symptomInput.addEventListener("input", function() {
    clearTimeout(parseTimer);
    var val = symptomInput.value.trim();
    if (val.length > 5) {
      parseTimer = setTimeout(function() { autoParseSymptoms(val); }, 800);
    } else {
      var t = document.getElementById("symptomTags");
      if (t) t.innerHTML = "";
      parsedSymptoms = [];
    }
  });
}

async function autoParseSymptoms(text) {
  var tc = document.getElementById("symptomTags");
  var age = document.getElementById("age").value || 30;
  var gender = document.getElementById("gender").value || "male";
  if (tc) tc.innerHTML = "<span style='color:var(--text3);font-size:0.78rem'>Symptoms samjha ja raha hai...</span>";
  try {
    var res = await parseSymptoms(text, Number(age), gender === "female" ? "female" : "male");
    parsedSymptoms = (res.data && res.data.mentions) || [];
    if (tc) {
      if (parsedSymptoms.length === 0) {
        tc.innerHTML = "<span style='color:var(--text3);font-size:0.78rem'>Koi symptom nahi mila — thoda aur detail mein likho</span>";
      } else {
        tc.innerHTML = parsedSymptoms.map(function(s) {
          return "<span class='symptom-tag'>" + s.name + "</span>";
        }).join("");
      }
    }
  } catch(e) {
    parsedSymptoms = [];
    if (tc) tc.innerHTML = "<span style='color:var(--text3);font-size:0.78rem'>Symptoms detect ho gaye — analysis hoga</span>";
  }
}

async function runAssessment() {
  var age      = document.getElementById("age").value;
  var gender   = document.getElementById("gender").value;
  var height   = document.getElementById("height").value;
  var weight   = document.getElementById("weight").value;
  var bp       = document.getElementById("bp").value;
  var glucose  = document.getElementById("glucose").value;
  var family   = getToggle("familyHistory");
  var smoking  = getToggle("smoking");
  var activity = getToggle("activity");
  var errEl    = document.getElementById("formError");

  if (!age || !height || !weight || !bp || !glucose) {
    errEl.style.display = "block";
    errEl.scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }
  errEl.style.display = "none";

  var symptomCheck = document.querySelector("#toggle-symptoms input");
  var medicineCheck = document.querySelector("#toggle-medicine input");
  var hospitalCheck = document.querySelector("#toggle-hospital input");
  var nutritionCheck = document.querySelector("#toggle-nutrition input");
  var diseaseCheck = document.querySelector("#toggle-disease input");

  var showSymptoms  = symptomCheck  ? symptomCheck.checked  : true;
  var showMedicine  = medicineCheck ? medicineCheck.checked : true;
  var showHospital  = hospitalCheck ? hospitalCheck.checked : true;
  var showNutrition = nutritionCheck? nutritionCheck.checked: true;
  var showDisease   = diseaseCheck  ? diseaseCheck.checked  : true;

  var medication = showMedicine ? document.getElementById("medication").value.trim() : "";
  var city       = showHospital ? document.getElementById("cityInput").value.trim()  : "";
  var specialty  = document.getElementById("providerSpecialty").value || "general";
  var symptomText = showSymptoms ? (document.getElementById("symptomText").value.trim()) : "";

  var loader = document.getElementById("loadingOverlay");
  loader.classList.add("show");

  try {
    var riskRes = await fetchRiskAssessment({
      age:age, gender:gender, height:height, weight:weight,
      bp:bp, glucose:glucose,
      familyHistory: family  || "no",
      smoking:       smoking || "no",
      activity:      activity|| "sedentary"
    });
    var result = riskRes.data;

    var nutritionData = null;
    if (showNutrition && result.needsNutrition) {
      try { nutritionData = (await fetchNutritionData("oats cooked","fooddata")).data; }
      catch(e) { console.warn("Nutrition:", e.message); }
    }

    var drugData = null;
    if (showMedicine && medication) {
      try { drugData = (await fetchDrugData(medication)).data; }
      catch(e) { console.warn("Drug:", e.message); }
    }

    var symptomResult = null;
    if (showSymptoms && (parsedSymptoms.length > 0 || symptomText)) {
      try { symptomResult = (await checkSymptoms(parsedSymptoms, Number(age), gender==="female"?"female":"male", symptomText)).data; }
      catch(e) { console.warn("Symptoms:", e.message); }
    }

    var providerData = null;
    if (showHospital && city) {
      try { providerData = (await findProviders(city, specialty)).data; }
      catch(e) { console.warn("Providers:", e.message); }
    }

    var diseaseStats = null;
    if (showDisease) {
      try { diseaseStats = (await fetchDiseaseStats("india")).data; }
      catch(e) {
        try { diseaseStats = (await fetchDiseaseStats()).data; }
        catch(e2) { console.warn("Disease:", e2.message); }
      }
    }

    loader.classList.remove("show");

    var payload = {
      result: result,
      nutritionData: nutritionData,
      drugData: drugData,
      symptomResult: symptomResult,
      providerData: providerData,
      diseaseStats: diseaseStats,
      medication: medication,
      flags: { showNutrition:showNutrition, showDisease:showDisease }
    };
    sessionStorage.setItem("hg_results", JSON.stringify(payload));
    window.location.href = "results.html";

  } catch(err) {
    loader.classList.remove("show");
    alert("Error: " + err.message + "\n\nBackend chal raha hai? localhost:5000 check karo.");
  }
}
