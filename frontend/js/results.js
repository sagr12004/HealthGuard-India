window.addEventListener("load", function() {
  var raw = sessionStorage.getItem("hg_results");
  if (!raw) { document.getElementById("noData").style.display="block"; return; }
  var payload = JSON.parse(raw);
  document.getElementById("noData").style.display = "none";
  document.getElementById("resultsContent").style.display = "block";
  if (typeof applyLang === "function") applyLang();
  renderAll(payload);
});

function getLang() { return (typeof currentLang !== "undefined") ? currentLang : "en"; }

function renderAll(payload) {
  var result=payload.result, nutritionData=payload.nutritionData, drugData=payload.drugData;
  var symptomResult=payload.symptomResult, providerData=payload.providerData;
  var diseaseStats=payload.diseaseStats, medication=payload.medication, flags=payload.flags||{};
  var lang=getLang();

  // HEALTH SCORE (inverse of risk)
  var healthScore = Math.max(0, 100 - result.riskPercentage);
  sessionStorage.setItem("hg_health_score", healthScore);
  sessionStorage.setItem("hg_last_score", result.riskPercentage);
  sessionStorage.setItem("hg_risk_level", result.riskLevel);
  sessionStorage.setItem("hg_bmi", result.bmi);

  var hsEl = document.getElementById("healthScoreNum");
  var hsBadge = document.getElementById("scoreLevelBadge");
  var hsSub = document.getElementById("healthScoreSub");
  if(hsEl) hsEl.textContent = healthScore;
  var levelLabels = {
    Low:      {en:"Excellent Health Zone", hi:"उत्कृष्ट स्वास्थ्य क्षेत्र", color:"#00d4aa"},
    Moderate: {en:"Good - Keep Improving", hi:"अच्छा - सुधार जारी रखो",   color:"#ffa500"},
    High:     {en:"Needs Attention",        hi:"ध्यान देना जरूरी",         color:"#ff4466"}
  };
  var ll = levelLabels[result.riskLevel]||levelLabels["Low"];
  if(hsBadge){ hsBadge.textContent=ll[lang]||ll["en"]; hsBadge.style.cssText="background:"+ll.color+"22;color:"+ll.color+";border:1px solid "+ll.color+"44;display:inline-block;padding:6px 20px;border-radius:20px;font-size:0.82rem;font-weight:700;margin-bottom:16px"; }
  if(hsSub) hsSub.textContent = lang==="hi" ? "100 में से" : "Out of 100";

  // RISK CARD
  var riskCard=document.getElementById("riskCard");
  riskCard.className="risk-card "+result.riskLevel.toLowerCase();
  var riskTexts={
    Low:{en:"Low Risk - All Good",hi:"कम जोखिम - ठीक है"},
    Moderate:{en:"Moderate Risk - Pay Attention",hi:"मध्यम जोखिम - ध्यान दो"},
    High:{en:"High Risk - See Doctor Immediately",hi:"अधिक जोखिम - तुरंत डॉक्टर से मिलो"}
  };
  var rt=riskTexts[result.riskLevel]||riskTexts["Low"];
  document.getElementById("riskLevelText").textContent=rt[lang]||rt["en"];
  document.getElementById("riskPercent").innerHTML=result.riskPercentage+'<span style="font-size:2rem">%</span>';
  document.getElementById("riskExplanation").textContent=result.explanation;

  var gaugeEl=document.getElementById("gaugeLabels");
  if(gaugeEl){ gaugeEl.innerHTML=lang==="hi"?"<span>0%</span><span>कम (0-30%)</span><span>मध्यम (31-60%)</span><span>अधिक (61%+)</span><span>100%</span>":"<span>0%</span><span>Low (0-30%)</span><span>Moderate (31-60%)</span><span>High (61%+)</span><span>100%</span>"; }

  setTimeout(function(){
    var fill=document.getElementById("gaugeFill");
    var colors={Low:"#00d4aa",Moderate:"#ffa500",High:"#ff4466"};
    var c=colors[result.riskLevel];
    fill.style.background=c; fill.style.boxShadow="0 0 14px "+c+"66"; fill.style.width=result.riskPercentage+"%";
  },200);

  var grid=document.getElementById("factorsGrid"); grid.innerHTML="";
  result.factors.forEach(function(f){
    var div=document.createElement("div"); div.className="factor-pill";
    div.innerHTML="<div class='factor-dot "+(f.isRisk?"risk":"ok")+"'></div><div class='factor-label'>"+f.factor+"</div>";
    grid.appendChild(div);
  });

  // BMI
  var bmiColors={Underweight:"#93c5fd",Normal:"#00d4aa",Overweight:"#ffa500",Obese:"#ff4466"};
  var bmiNotes={
    Underweight:{en:"Below 18.5 - consult a nutritionist.",hi:"18.5 से कम - पोषण विशेषज्ञ से मिलो।"},
    Normal:{en:"18.5-24.9 - perfectly fine!",hi:"18.5-24.9 - बिल्कुल ठीक है!"},
    Overweight:{en:"25-29.9 - watch diet and exercise.",hi:"25-29.9 - खाने और व्यायाम पर ध्यान दो।"},
    Obese:{en:"30+ - please consult a doctor.",hi:"30 या ज्यादा - डॉक्टर से जरूर मिलो।"}
  };
  var bmiText={Underweight:{en:"Underweight",hi:"वजन कम"},Normal:{en:"Normal",hi:"सामान्य"},Overweight:{en:"Overweight",hi:"अधिक वजन"},Obese:{en:"Obese",hi:"मोटापा"}};
  var bc=bmiColors[result.bmiCategory]||"#a0a0c0";
  document.getElementById("bmiValue").textContent=result.bmi;
  var bn=bmiNotes[result.bmiCategory]; document.getElementById("bmiNote").textContent=bn?(bn[lang]||bn["en"]):"";
  var bmiCatEl=document.getElementById("bmiCat"); var bt=bmiText[result.bmiCategory];
  bmiCatEl.textContent=bt?(bt[lang]||bt["en"]):result.bmiCategory;
  bmiCatEl.style.cssText="padding:6px 16px;border-radius:20px;font-size:0.78rem;font-weight:600;background:"+bc+"22;color:"+bc+";border:1px solid "+bc+"44;";

  if(typeof renderRadarChart==="function") setTimeout(function(){ renderRadarChart(result.factors,result.riskLevel); },300);

  renderNutrition(nutritionData,result.needsNutrition&&flags.showNutrition!==false,lang);
  renderDrug(drugData,medication,lang);
  renderSymptomResults(symptomResult,lang);
  renderProviders(providerData,lang);
  renderDiseaseStats(diseaseStats,flags.showDisease!==false,lang);

  var recList=document.getElementById("recList");
  recList.innerHTML=result.recommendations.map(function(r){
    return "<div class='rec-item'><span class='rec-icon'>"+r.icon+"</span><span>"+r.text+" <span class='rec-priority "+r.priority+"'>"+r.priority+"</span></span></div>";
  }).join("");
}

function renderNutrition(data,needed,lang){
  var infoGrid=document.getElementById("infoGrid"),nutCard=document.getElementById("nutritionCard"),nutList=document.getElementById("nutrientList");
  if(!needed){nutCard.style.display="none";return;}
  infoGrid.style.display="grid"; nutCard.style.display="block";
  if(!data){nutList.innerHTML="<div class='loading-placeholder'>Add FOODDATA_API_KEY to .env for nutrition data</div>";return;}
  var n=data.nutrients;
  var items=[{name:"Energy",obj:n.energy,color:"#ff4466",max:400},{name:"Protein",obj:n.protein,color:"#00d4aa",max:30},{name:"Fat",obj:n.totalFat,color:"#ffa500",max:20},{name:"Carbs",obj:n.carbohydrates,color:"#6366f1",max:80},{name:"Fiber",obj:n.fiber,color:"#a855f7",max:10},{name:"Sugars",obj:n.sugars,color:"#f43f5e",max:20}];
  nutList.innerHTML="<div style='font-size:0.72rem;color:var(--text3);margin-bottom:10px'>"+data.foodName+" - "+data.servingSize+"</div>";
  items.forEach(function(item){
    var val=item.obj?item.obj.value+" "+item.obj.unit:"N/A";
    var pct=Math.min(100,((item.obj&&item.obj.value||0)/item.max)*100);
    nutList.innerHTML+="<div class='nutrient-row'><span class='nutrient-name'>"+item.name+"</span><div class='nutrient-bar-wrap'><div class='nutrient-bar' style='width:"+pct+"%;background:"+item.color+"'></div></div><span class='nutrient-val'>"+val+"</span></div>";
  });
}

function renderDrug(data,medication,lang){
  var infoGrid=document.getElementById("infoGrid"),drugCard=document.getElementById("drugCard"),drugEl=document.getElementById("drugInfo");
  if(!medication){drugCard.style.display="none";return;}
  drugCard.style.display="block"; infoGrid.style.display="grid";
  if(!data){drugEl.innerHTML="<div class='loading-placeholder'>No FDA data found for "+medication+"</div>";return;}
  var sections=[{label:"Drug Name",val:data.drugName},{label:"Brand Name",val:data.brandName},{label:"Drug Class",val:data.drugClass},{label:"What It Is For",val:data.indications},{label:"Warnings",val:data.warnings},{label:"Dosage",val:data.dosage},{label:"Side Effects",val:data.adverseReactions}];
  drugEl.innerHTML=sections.filter(function(s){return s.val;}).map(function(s){
    return "<div class='drug-block'><div class='drug-block-label'>"+s.label+"</div><div class='drug-block-text'>"+s.val.slice(0,400)+(s.val.length>400?"...":"")+"</div></div>";
  }).join("");
}

function renderSymptomResults(data,lang){
  var el=document.getElementById("symptomResults"); if(!el)return;
  if(!data||(!data.diagnosis||!data.diagnosis.length)&&!data.triage){el.style.display="none";return;}
  el.style.display="block";
  var title=lang==="hi"?"लक्षणों का विश्लेषण":"Symptom Analysis";
  var html="<div class='chart-card-title'>"+title+"</div>";
  if(data.triage){ var lvl=data.triage.level||"self_care"; html+="<div class='triage-box "+lvl+"'><div class='triage-level'>"+(lang==="hi"?"डॉक्टर की जरूरत?":"Doctor Required?")+"</div><div class='triage-label'>"+(data.triage.label||lvl)+"</div></div>"; }
  if(data.diagnosis&&data.diagnosis.length){
    html+="<div style='font-size:0.72rem;color:var(--text3);text-transform:uppercase;margin-bottom:8px'>"+(lang==="hi"?"संभावित स्थितियां:":"Possible Conditions:")+"</div>";
    data.diagnosis.forEach(function(d){ var pct=d.probability; var color=pct>=60?"var(--high)":pct>=30?"var(--mod)":"var(--accent3)"; html+="<div class='condition-row'><span class='condition-name'>"+(d.commonName||d.name)+"</span><span class='condition-pct' style='color:"+color+"'>"+pct+"%</span></div>"; });
  }
  el.innerHTML=html;
}

function renderProviders(data,lang){
  var el=document.getElementById("providerResults"); if(!el)return;
  if(!data||!data.providers||!data.providers.length){el.style.display="none";return;}
  el.style.display="block";
  var title=lang==="hi"?"नजदीकी अस्पताल":"Nearby Hospitals";
  var mapsText=lang==="hi"?"गूगल मैप्स में खोलो":"Open in Google Maps";
  var html="<div class='chart-card-title'>"+title+" - "+(data.city||"")+"</div>";
  data.providers.forEach(function(p){
    var addr=p.address.line1+", "+p.address.city+", "+p.address.state;
    var mapsUrl="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.name+" "+p.address.city+" India");
    html+="<div class='provider-card'><div class='provider-name'>"+p.name+"</div><div class='provider-specialty'>"+p.specialty+"</div><div class='provider-detail'>"+addr+"</div>"+(p.phone?"<div class='provider-detail'>"+p.phone+"</div>":"")+"<a href='"+mapsUrl+"' target='_blank' class='provider-maps-link'>"+mapsText+"</a></div>";
  });
  el.innerHTML=html;
}

function renderDiseaseStats(data,show,lang){
  var el=document.getElementById("diseaseStats"); if(!el||!show){if(el)el.style.display="none";return;}
  if(!data){el.style.display="none";return;}
  el.style.display="block";
  var c=data.covid||data; var fmt=function(n){return n?Number(n).toLocaleString("en-IN"):"N/A";};
  var title=lang==="hi"?"रोग आंकड़े - भारत / वैश्विक":"Disease Stats - India / Global";
  el.innerHTML="<div class='chart-card-title'>"+title+"</div><div class='stat-grid'><div class='stat-box cases'><div class='stat-num'>"+fmt(c.cases)+"</div><div class='stat-label'>"+(lang==="hi"?"कुल मामले":"Total Cases")+"</div></div><div class='stat-box deaths'><div class='stat-num'>"+fmt(c.deaths)+"</div><div class='stat-label'>"+(lang==="hi"?"कुल मौतें":"Total Deaths")+"</div></div><div class='stat-box recovered'><div class='stat-num'>"+fmt(c.recovered)+"</div><div class='stat-label'>"+(lang==="hi"?"स्वस्थ हुए":"Recovered")+"</div></div><div class='stat-box active'><div class='stat-num'>"+fmt(c.active||c.todayCases)+"</div><div class='stat-label'>"+(lang==="hi"?"सक्रिय":"Active")+"</div></div></div>";
}