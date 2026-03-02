var extractedData = {};

function analyzeReport() {
  var text = document.getElementById("reportText").value.trim();
  if (!text) { alert("Kuch toh likho pehle!"); return; }
  var parsed = parseReportText(text);
  showExtractedForm(parsed, text);
}

function parseReportText(text) {
  var data = {};
  var t = text.toLowerCase();

  // Age
  var ageMatch = t.match(/(\d{1,3})\s*(year|saal|sal|yr|age|umar)/i) || t.match(/(age|umar)[:\s]+(\d{1,3})/i);
  if (ageMatch) data.age = ageMatch[1] || ageMatch[2];

  // Height
  var htMatch = t.match(/height[:\s]+(\d{2,3})\s*cm/i) || t.match(/(\d{2,3})\s*cm\s*(height|tall|lamba)/i) || t.match(/lambaai[:\s]+(\d{2,3})/i);
  if (htMatch) data.height = htMatch[1];

  // Weight
  var wtMatch = t.match(/weight[:\s]+(\d{2,3})\s*kg/i) || t.match(/(\d{2,3})\s*kg\s*(weight|wajan)/i) || t.match(/wajan[:\s]+(\d{2,3})/i);
  if (wtMatch) data.weight = wtMatch[1];

  // BP
  var bpMatch = t.match(/bp[:\s]+(\d{2,3})\s*[\/\\]\s*\d{2,3}/i) || t.match(/blood pressure[:\s]+(\d{2,3})/i) || t.match(/(\d{2,3})\s*\/\s*\d{2,3}\s*mmhg/i);
  if (bpMatch) data.bp = bpMatch[1];

  // Glucose
  var glMatch = t.match(/sugar[:\s]+(\d{2,3})/i) || t.match(/glucose[:\s]+(\d{2,3})/i) || t.match(/blood sugar[:\s]+(\d{2,3})/i) || t.match(/fasting[:\s]+(\d{2,3})/i) || t.match(/(\d{2,3})\s*mg\/dl/i);
  if (glMatch) data.glucose = glMatch[1];

  // Symptoms
  var symKeywords = ["chest pain","headache","fever","cough","dizziness","vomiting","weakness","fatigue","shortness of breath","stomach pain","back pain","joint pain","nausea","swelling","seene mein dard","sir dard","bukhar","khansi","chakkar","ulti","kamzori","pet dard","kamar dard","sans ki takleef"];
  var foundSymptoms = symKeywords.filter(function(s) { return t.includes(s); });
  data.symptoms = foundSymptoms.join(", ");

  // Medicine
  var medKeywords = ["metformin","amlodipine","atorvastatin","lisinopril","telmisartan","crocin","dolo","combiflam","azithromycin","amoxicillin","pantoprazole","omeprazole","aspirin","ibuprofen","paracetamol","telma","glycomet","stamlo","atorva","montek","asthalin","metrogyl","norflox"];
  var foundMeds = medKeywords.filter(function(m) { return t.includes(m); });
  data.medicine = foundMeds.join(", ");

  return data;
}

function showExtractedForm(data, rawText) {
  extractedData = data;
  extractedData.rawText = rawText;

  if (data.age)      document.getElementById("r-age").value      = data.age;
  if (data.height)   document.getElementById("r-height").value   = data.height;
  if (data.weight)   document.getElementById("r-weight").value   = data.weight;
  if (data.bp)       document.getElementById("r-bp").value       = data.bp;
  if (data.glucose)  document.getElementById("r-glucose").value  = data.glucose;
  if (data.symptoms) document.getElementById("r-symptoms").value = data.symptoms;
  if (data.medicine) document.getElementById("r-medicine").value = data.medicine;

  document.getElementById("extractedForm").style.display = "block";
  document.getElementById("extractedForm").scrollIntoView({ behavior:"smooth", block:"start" });
}

async function submitExtractedData() {
  var age     = document.getElementById("r-age").value;
  var height  = document.getElementById("r-height").value;
  var weight  = document.getElementById("r-weight").value;
  var bp      = document.getElementById("r-bp").value;
  var glucose = document.getElementById("r-glucose").value;
  var symptoms= document.getElementById("r-symptoms").value;
  var medicine= document.getElementById("r-medicine").value;
  var errEl   = document.getElementById("reportError");

  if (!age || !height || !weight || !bp || !glucose) {
    errEl.style.display = "block";
    errEl.scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }
  errEl.style.display = "none";

  var loader = document.getElementById("loadingOverlay");
  loader.classList.add("show");

  try {
    var riskRes = await fetchRiskAssessment({
      age:age, height:height, weight:weight, bp:bp, glucose:glucose,
      familyHistory:"no", smoking:"no", activity:"sedentary"
    });
    var result = riskRes.data;

    var symptomResult = null;
    if (symptoms) {
      try {
        var parsed = await parseSymptoms(symptoms, Number(age), "male");
        var mentions = (parsed.data && parsed.data.mentions) || [];
        symptomResult = (await checkSymptoms(mentions, Number(age), "male", symptoms)).data;
      } catch(e) { console.warn("Symptoms:", e.message); }
    }

    var drugData = null;
    if (medicine) {
      try { drugData = (await fetchDrugData(medicine.split(",")[0].trim())).data; }
      catch(e) { console.warn("Drug:", e.message); }
    }

    var diseaseStats = null;
    try { diseaseStats = (await fetchDiseaseStats("india")).data; }
    catch(e) { try { diseaseStats = (await fetchDiseaseStats()).data; } catch(e2){} }

    loader.classList.remove("show");

    var payload = {
      result: result,
      nutritionData: null,
      drugData: drugData,
      symptomResult: symptomResult,
      providerData: null,
      diseaseStats: diseaseStats,
      medication: medicine.split(",")[0].trim(),
      flags: { showNutrition:false, showDisease:true }
    };
    sessionStorage.setItem("hg_results", JSON.stringify(payload));
    window.location.href = "results.html";

  } catch(err) {
    loader.classList.remove("show");
    alert("Error: " + err.message);
  }
}

function handleFileUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var text = e.target.result;
    document.getElementById("extractedText").textContent = text.slice(0, 2000);
    document.getElementById("uploadPreview").style.display = "block";
    document.getElementById("uploadPreview").scrollIntoView({ behavior:"smooth", block:"start" });
    var parsed = parseReportText(text);
    extractedData = parsed;
    extractedData.rawText = text;
  };
  if (file.type === "application/pdf") {
    document.getElementById("extractedText").textContent = "PDF se text extract karne ke liye report ka content manually paste karo Option 1 mein.";
    document.getElementById("uploadPreview").style.display = "block";
  } else {
    reader.readAsText(file);
  }
}

function analyzeExtractedReport() {
  if (!extractedData.rawText) { alert("Pehle file upload karo ya text paste karo"); return; }
  showExtractedForm(extractedData, extractedData.rawText);
}

function resetUpload() {
  document.getElementById("reportText").value = "";
  document.getElementById("extractedForm").style.display = "none";
  document.getElementById("uploadPreview").style.display = "none";
  document.getElementById("reportResults").style.display = "none";
  extractedData = {};
  window.scrollTo({ top:0, behavior:"smooth" });
}
