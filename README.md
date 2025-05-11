# 🧃🎙️ SahaayAI – Voice-First AI Companion for the Elderly

**SahaayAI** is a voice-first, multilingual AI assistant designed to bridge the digital divide for senior citizens. Built with emotional intelligence and accessibility in mind, it simplifies access to information, health reminders, and digital services through natural speech — with the comforting option of mimicking familiar voices.

---

## 🚨 Problem

Senior citizens are increasingly disconnected from today's digital world due to complex interfaces, lack of support, and social isolation — leading to reduced access to healthcare, services, and companionship.

---

## 💡 Solution

**SahaayAI** offers a voice-based, multilingual AI companion that mimics the voice of a loved one to help with daily wellness, provide reminders, and offer meaningful interaction — all through simple, intuitive speech commands.

---

## 🛠️ Tech Stack

### 🔹 Frontend

| Category         | Tech Used                  | Purpose                                     |
| ---------------- | -------------------------- | ------------------------------------------- |
| Framework        | React + TypeScript         | Component-based UI with static typing       |
| Styling          | Tailwind CSS               | Fast, utility-first styling                 |
| Build Tool       | Vite                       | Lightweight bundling and dev server         |
| UI Components    | shadcn/ui                  | Accessible prebuilt components              |
| Routing          | React Router               | SPA navigation                              |
| Notifications    | Sonner                     | Toast notifications                         |
| Icons            | Lucide React               | Icon set                                    |
| Voice Handling   | Web Speech API, ElevenLabs | Speech recognition and text-to-speech       |
| Data Persistence | localStorage               | Save voice settings and preferences locally |

---

### 🔹 Backend

| Category        | Tech / Library                              | Role                                        |
| --------------- | ------------------------------------------- | ------------------------------------------- |
| Framework       | Flask, Flask-CORS                           | Backend APIs and CORS support               |
| AI / LLM        | Google Gemini (google.generativeai)         | LLM responses and multilingual support      |
| ML / Processing | scikit-learn, numpy, pandas                 | Data handling, anomaly detection            |
| Voice Tech      | ElevenLabs, Whisper, Google STT             | Voice cloning and transcription             |
| Storage         | Firebase                                    | User data and reminders                     |
| PDF Generator   | reportlab                                   | Downloadable health summaries               |
| File Utilities  | os, hashlib                                 | File processing                             |
| Core Scripts    | main.py, call\_handler.py, tts\_feedback.py | App logic, call simulation, feedback system |
| File Serving    | render\_template, send\_file                | Serve templates and downloadable content    |

---

## ✨ Key Features

* 🎤 Natural voice input using Web Speech API or Whisper
* 🗣️ Emotionally resonant output with ElevenLabs voice cloning
* 🧠 Smart LLM responses (via Gemini)
* 📋 Health summary PDF generation
* ⏱️ Adjustable response delay and voice preferences
* 🌐 Multilingual support and contextual memory
* 🦳 Nostalgic UI designed for seniors
* 🔐 Optional OTP login for caregiver-linked accounts

---

## ⚙️ Installation Instructions

### 🔧 Prerequisites

* **Node.js** (v16+)
* **Python** (3.8+)
* **Git**

---

### ✅ 1. Clone the Repository

git clone https://github.com/edsnowde/Sahaayai-AI.git
cd sahaayai

### ✅ 2. Frontend Setup (React + Vite)
cd client
npm install       # Install dependencies
npm run dev       # Start frontend at http://localhost:5173


### ✅ 3. Backend Setup (Flask + Gemini + ElevenLabs)

cd ../server
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate

pip install -r requirements.txt

If `requirements.txt` is missing:

pip install flask flask-cors google-generativeai python-dotenv scikit-learn pandas numpy reportlab


### 🔐 4. Configure Environment Variables

Create a `.env` file inside `/server`:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"..."}  # Firebase JSON as one line

### ▶️ 5. Run the Backend
python main.py

Backend runs at `http://127.0.0.1:5000`

---

### 📁 Folder Structure

```
sahaayai/
├── client/               # React frontend
├── server/               # Flask backend
│   ├── main.py
│   ├── call_handler.py
│   ├── tts_feedback.py
│   ├── templates/
│   └── .env              # (ignored in Git)
└── README.md
```

---

### 📃 .gitignore Highlights

```
# Python
__pycache__/
*.pyc
.env
venv/

# Node.js
node_modules/
dist/

# OS & Editor
.vscode/
.DS_Store
Thumbs.db
```

---
