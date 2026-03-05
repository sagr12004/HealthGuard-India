
# HealthGuard India 🏥

> **Free preventive health platform built for 1.4 billion Indians**  
> Check your risk for diabetes, BP, and heart disease — in Hindi or English.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-healthguard--india.netlify.app-FF6B00?style=for-the-badge)](https://healthguard-india.netlify.app)
[![Backend API](https://img.shields.io/badge/⚡_API-healthguard--india.onrender.com-6366F1?style=for-the-badge)](https://healthguard-india.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-sagr12004%2FHealthGuard--India-181717?style=for-the-badge&logo=github)](https://github.com/sagr12004/HealthGuard-India)

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 📸 Screenshots

| Home Page | Health Check | Results | Diet Plan |
|-----------|-------------|---------|-----------|
| Risk calculator with 7 factors | Fill form with your data | Health Score + Report Card | 7-day Indian meal plans |

---

## ✨ Features

### 🩺 Health Risk Assessment
- **7-factor weighted scoring** — Age, BMI, BP, Blood Sugar, Family History, Smoking, Activity
- Risk score from **0–100%** with Low / Moderate / High classification
- **Health Score** (inverse of risk) displayed as your personal wellness number
- Detailed factor breakdown with radar chart

### 📊 Blood Report Parser
- Paste text from lab reports (CellPath, SRL, Dr Lal etc.)
- Extracts **16+ values** — Glucose, HbA1c, Cholesterol, HDL, LDL, Triglycerides, Vitamin D, B12, Hemoglobin, TSH, Creatinine, eGFR, ESR and more
- Color-coded results (Normal / Borderline / Abnormal)
- Auto-fills risk assessment form

### 🥗 7-Day Indian Diet Plans
- **7 condition-specific plans** — Diabetes, High BP, High Cholesterol, Low B12/Anaemia, Low Vitamin D, Weight Loss, General Health
- Day-by-day Indian meals with nutritional tags
- Smart auto-selection based on your risk results

### 💊 Medicine Reminders
- Add medicine names and set daily reminder times
- Browser notification alerts
- Persistent storage across sessions

### 👨‍👩‍👧‍👦 Family Health Tracker
- Add unlimited family members (Papa, Mummy, Bhai, Behen...)
- Individual risk calculation for each member
- **Combined family risk score** with insights
- Downloadable family health report card (PNG)

### 💡 Health Tips (Hindi + English)
- **35+ science-backed health tips** across 6 categories
- Blood Sugar, BP, Nutrition, Fitness, Mental Health, General
- Each tip shareable directly on **WhatsApp**
- Tip of the Day feature
- Search and filter tips

### 📤 Share & Social Features
- **WhatsApp share** — share your score with family
- **Challenge a Friend** — send your score as a challenge
- **Download Report Card** — beautiful PNG with your Health Score, Risk %, BMI
- Copy link for any platform

### 🌐 Bilingual Support
- Full **Hindi (हिंदी) + English** toggle
- Noto Sans Devanagari font for perfect Hindi rendering
- Persists across all pages

### 🌙 Dark / Light Mode
- Smooth theme toggle
- Persists across sessions via localStorage

---

## 🏗️ Tech Stack

### Frontend
| Technology | Usage |
|-----------|-------|
| HTML5 / CSS3 | Structure and styling |
| Vanilla JavaScript | All interactions |
| Chart.js 4.4 | Radar chart for risk factors |
| Google Fonts | Poppins + Noto Sans Devanagari |
| Canvas API | Report card PNG generation |
| Web Notifications API | Medicine reminders |
| SessionStorage / LocalStorage | Data persistence |

### Backend
| Technology | Usage |
|-----------|-------|
| Node.js 18 | Runtime |
| Express 4 | Web framework |
| Helmet | Security headers |
| CORS | Cross-origin requests |
| express-rate-limit | API rate limiting (150 req/15min) |
| dotenv | Environment variables |
| Axios | External API calls |

### External APIs
| API | Usage |
|-----|-------|
| USDA FoodData Central | Nutrition data |
| openFDA | Medicine information |
| disease.sh | COVID/disease statistics |
| NPPES NPI Registry | Hospital/doctor lookup |
| Infermedica *(optional)* | Symptom checker AI |

### Deployment
| Service | Purpose |
|---------|---------|
| **Netlify** | Frontend hosting (free) |
| **Render** | Backend API hosting (free) |
| **GitHub** | Version control |

---

## 🚀 Live Demo

🌐 **Website:** [https://healthguard-india.netlify.app](https://healthguard-india.netlify.app)  
⚡ **API Health:** [https://healthguard-india.onrender.com/api/health](https://healthguard-india.onrender.com/api/health)

> **Note:** Backend is on Render free tier — first request may take 30–50 seconds to wake up (cold start). Subsequent requests are fast.

---

## 📁 Project Structure

```
HealthGuard/
├── backend/
│   ├── controllers/
│   │   ├── riskController.js       # Risk scoring engine
│   │   ├── nutritionController.js  # USDA FoodData integration
│   │   ├── drugController.js       # openFDA integration
│   │   ├── symptomController.js    # Infermedica integration
│   │   ├── providerController.js   # Hospital lookup (NPPES)
│   │   ├── diseaseController.js    # Disease stats
│   │   └── insuranceController.js  # Insurance data
│   ├── routes/
│   │   ├── risk.js
│   │   ├── nutrition.js
│   │   ├── drug.js
│   │   ├── symptom.js
│   │   ├── provider.js
│   │   ├── disease.js
│   │   └── insurance.js
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── styles.css              # Complete design system
│   ├── js/
│   │   ├── lang.js                 # Bilingual translations (EN/HI)
│   │   ├── theme.js                # Theme + language system
│   │   ├── api.js                  # All backend API calls
│   │   ├── main.js                 # Health check form logic
│   │   ├── results.js              # Results rendering
│   │   ├── chart.js                # Radar chart
│   │   └── upload.js               # Blood report parser
│   ├── index.html                  # Home page
│   ├── assess.html                 # Health check form
│   ├── results.html                # Results + Health Score
│   ├── upload.html                 # Blood report upload
│   ├── diet.html                   # 7-day diet plans
│   ├── family.html                 # Family health tracker
│   ├── tips.html                   # Health tips
│   └── about.html                  # About page
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/sagr12004/HealthGuard-India.git
cd HealthGuard-India
```

### Step 2 — Install backend dependencies
```bash
cd backend
npm install
```

### Step 3 — Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
PORT=5000
NODE_ENV=development
FOODDATA_API_KEY=your_usda_key_here
OPENFDA_API_KEY=your_fda_key_here
INFERMEDICA_APP_ID=your_infermedica_id
INFERMEDICA_API_KEY=your_infermedica_key
```

### Step 4 — Start backend server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs at: `http://localhost:5000`

### Step 5 — Open frontend
Open `frontend/index.html` in browser, or use Live Server in VS Code.

> Make sure `frontend/js/api.js` has `API_BASE = "http://localhost:5000/api"`

---

## 🌍 Deployment Guide

### Backend → Render (Free)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect GitHub repo: `sagr12004/HealthGuard-India`
3. Settings:
   ```
   Root Directory:  backend
   Build Command:   npm install
   Start Command:   node server.js
   Region:          Singapore
   ```
4. Add Environment Variables (from your `.env`)
5. Deploy → get URL like `https://healthguard-india.onrender.com`

### Frontend → Netlify (Free)

**Option A — Drag & Drop:**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the `frontend/` folder into deploy zone
3. Set site name to `healthguard-india`

**Option B — GitHub CI/CD:**
1. New site → Import from Git
2. Set **Publish directory:** `frontend`
3. Auto-deploys on every `git push`

### Update API URL after deployment
```bash
# In frontend/js/api.js
var API_BASE = "https://healthguard-india.onrender.com/api";
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status check |
| POST | `/api/risk` | Calculate health risk score |
| GET | `/api/nutrition?food=` | Get nutrition data |
| GET | `/api/drug?medicine=` | Get medicine info |
| POST | `/api/symptom/parse` | Parse symptom text |
| POST | `/api/symptom/check` | Check symptoms via AI |
| GET | `/api/provider?city=&specialty=` | Find nearby hospitals |
| GET | `/api/disease?name=` | Get disease statistics |

### Sample Risk API Request
```json
POST /api/risk
{
  "age": 35,
  "height": 170,
  "weight": 80,
  "bp": 130,
  "glucose": 105,
  "familyHistory": "yes",
  "smoking": "no",
  "activity": "sedentary"
}
```

### Sample Risk API Response
```json
{
  "data": {
    "riskScore": 9,
    "riskPercentage": 50,
    "riskLevel": "Moderate",
    "bmi": 27.7,
    "bmiCategory": "Overweight",
    "explanation": "Moderate risk due to BP and BMI.",
    "factors": [
      { "factor": "Blood Pressure", "isRisk": true },
      { "factor": "BMI", "isRisk": true }
    ],
    "recommendations": [
      { "icon": "🥗", "text": "Reduce salt intake", "priority": "high" }
    ]
  }
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo
git clone https://github.com/YOUR_USERNAME/HealthGuard-India.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Commit
git add .
git commit -m "Add: your feature description"

# Push and create Pull Request
git push origin feature/your-feature-name
```

### Ideas for contributions
- Add more Indian cities to hospital database
- Add more health tips in regional languages (Tamil, Telugu, Bengali)
- Integrate Apollo/Practo booking API
- Add BMI trend tracking over time
- PWA support (offline mode)

---

## 📋 Roadmap

- [x] Health risk calculator (7 factors)
- [x] Blood report PDF parser
- [x] 7-day Indian diet plans
- [x] Medicine reminders with notifications
- [x] Family health tracker
- [x] WhatsApp share + Challenge a friend
- [x] Downloadable health report card
- [x] Hindi + English bilingual support
- [x] Dark / Light mode
- [x] Production deployment
- [ ] PWA / offline support
- [ ] Regional language support (Tamil, Telugu, Marathi)
- [ ] AI blood report explainer in Hindi
- [ ] Health score history tracking
- [ ] Practo / Apollo booking integration
- [ ] Mobile app (React Native)

---

## ⚠️ Medical Disclaimer

> **HealthGuard India is NOT a medical device and does NOT diagnose any disease.**  
> All results are estimates based on statistical models for awareness purposes only.  
> Always consult a qualified and licensed medical doctor for proper diagnosis and treatment.  
> This tool is for **health awareness only.**

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

## 👨‍💻 Made By

<div align="center">

**Sagar**  
Built with passion to improve health awareness in India 🇮🇳  
Using technology to make healthcare more accessible for everyone.

⭐ **Star this repo if you found it useful!** ⭐

[![GitHub](https://img.shields.io/badge/GitHub-sagr12004-181717?logo=github&style=flat-square)](https://github.com/sagr12004)

</div>

---

<div align="center">
Made with ❤️ for India | HealthGuard India 2026
</div>
