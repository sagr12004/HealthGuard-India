const indianSymptomMap = {
  "sir dard": "headache", "sar dard": "headache", "headche": "headache", "head pain": "headache", "sir mein dard": "headache", "migraine": "headache",
  "bukhar": "fever", "bukhaar": "fever", "fever": "fever", "body hot": "fever", "temperature": "fever", "garmi lag rahi": "fever",
  "khansi": "cough", "khaansi": "cough", "cough": "cough", "dry cough": "cough", "wet cough": "cough", "khasi": "cough",
  "seene mein dard": "chest pain", "chest dard": "chest pain", "chest pain": "chest pain", "heart pain": "chest pain", "dil mein dard": "chest pain", "heartpain": "chest pain",
  "pet dard": "stomach pain", "stomach ache": "stomach pain", "pet mein dard": "stomach pain", "abdominal pain": "stomach pain", "stomach pain": "stomach pain", "pet dukh raha": "stomach pain",
  "sans lene mein takleef": "shortness of breath", "saans ki takleef": "shortness of breath", "breathlessness": "shortness of breath", "breathing problem": "shortness of breath", "saans nahi aa raha": "shortness of breath",
  "ulti": "vomiting", "vomiting": "vomiting", "nausea": "nausea", "ji machal raha": "nausea", "ulta ho raha": "nausea", "chakkar aa raha": "dizziness",
  "chakkar": "dizziness", "dizziness": "dizziness", "ghabrahat": "anxiety", "weakness": "weakness", "kamzori": "weakness", "thakaan": "fatigue", "bahut thaka hua": "fatigue",
  "dast": "diarrhea", "loose motion": "diarrhea", "diarrhea": "diarrhea", "pechish": "diarrhea", "kabjiyat": "constipation", "constipation": "constipation",
  "sugar high": "high blood sugar", "sugar zyada": "high blood sugar", "diabetes problem": "high blood sugar", "bp high": "high blood pressure", "bp zyada": "high blood pressure", "blood pressure high": "high blood pressure",
  "joint pain": "joint pain", "ghutne mein dard": "knee pain", "kamar dard": "back pain", "back pain": "back pain", "peeth dard": "back pain",
  "ankh mein dard": "eye pain", "aankhon mein jalan": "eye irritation", "skin rash": "skin rash", "khujli": "itching", "daane": "skin rash",
  "neend nahi": "insomnia", "sleep problem": "insomnia", "bhook nahi": "loss of appetite", "weight loss": "weight loss", "wajan kam ho raha": "weight loss",
  "paon mein sujan": "leg swelling", "haath sujan": "hand swelling", "swelling": "swelling", "sujan": "swelling",
  "memory loss": "memory problems", "bhool jaana": "memory problems", "depression": "depression", "udaasi": "depression", "anxiety": "anxiety"
};

const medicineMap = {
  "crocin": "paracetamol", "calpol": "paracetamol", "dolo": "paracetamol 650", "dolo 650": "paracetamol",
  "combiflam": "ibuprofen paracetamol", "brufen": "ibuprofen", "disprin": "aspirin",
  "pan 40": "pantoprazole", "pan d": "pantoprazole domperidone", "omez": "omeprazole", "gelusil": "antacid",
  "metformin": "metformin", "glycomet": "metformin", "glucophage": "metformin",
  "telma": "telmisartan", "amlodipine": "amlodipine", "amlong": "amlodipine", "stamlo": "amlodipine",
  "atorva": "atorvastatin", "lipitor": "atorvastatin", "rosuvastatin": "rosuvastatin",
  "azithromycin": "azithromycin", "zithromax": "azithromycin", "azithral": "azithromycin",
  "amoxicillin": "amoxicillin", "novamox": "amoxicillin", "mox": "amoxicillin",
  "montek": "montelukast", "asthalin": "salbutamol", "foracort": "budesonide formoterol",
  "metrogyl": "metronidazole", "flagyl": "metronidazole", "norflox": "norfloxacin",
  "vitamin d": "cholecalciferol", "calcirol": "vitamin d", "shelcal": "calcium carbonate",
  "neurobion": "vitamin b complex", "becosules": "vitamin b complex"
};

const mapIndianSymptoms = (text) => {
  if (!text) return text;
  let mapped = text.toLowerCase();
  Object.keys(indianSymptomMap).forEach(key => {
    const regex = new RegExp(key, "gi");
    mapped = mapped.replace(regex, indianSymptomMap[key]);
  });
  return mapped;
};

const mapIndianMedicine = (name) => {
  if (!name) return name;
  const lower = name.toLowerCase().trim();
  return medicineMap[lower] || name;
};

const extractSymptomsFromText = (text) => {
  if (!text) return [];
  const mapped = mapIndianSymptoms(text);
  const commonSymptoms = [
    "headache","fever","cough","chest pain","stomach pain","shortness of breath",
    "vomiting","nausea","dizziness","weakness","fatigue","diarrhea","constipation",
    "high blood sugar","high blood pressure","joint pain","knee pain","back pain",
    "eye pain","skin rash","itching","insomnia","loss of appetite","weight loss",
    "swelling","memory problems","depression","anxiety","leg swelling"
  ];
  const found = [];
  commonSymptoms.forEach(symptom => {
    if (mapped.includes(symptom)) found.push(symptom);
  });
  return found;
};

module.exports = { mapIndianSymptoms, mapIndianMedicine, extractSymptomsFromText };
