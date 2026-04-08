# 🛡️ AnonMitra — Identity & Integrity Protection System

> *Anon* (Anonymous) + *Mitra* (Friend in Sanskrit) — Your anonymous ally in the digital world.

AnonMitra is a full-stack cybersecurity platform that protects users on two fronts: **digital identity theft** and **AI-generated misinformation**. Built for ProTech 2026 at Symbiosis Institute of Technology, Pune — technically co-sponsored by IEEE Maharashtra Section.

---

## 🌍 The Problem

Every time you sign up for a new app or service, you hand over your real email address. The moment you do that, you lose control. That email gets sold, leaked, or spammed — and you have no idea which platform betrayed you.

Simultaneously, AI-generated misinformation is spreading at a scale the internet was never designed to handle.

**15 billion credentials were leaked in 2024 alone.**

---

## 💡 What AnonMitra Does

AnonMitra gives you two layers of protection:

### 🪪 Identity Protection
- Generate isolated virtual identities — unique email aliases, usernames, and strong passwords — for different platforms
- Each identity is stored in an AES-encrypted vault
- A three-layer engine (rule-based + ML classifier + feedback loop) scores every incoming message for risk
- Each identity gets a live risk badge: 🟢 Safe / 🟡 Moderate / 🔴 High Risk
- Analytics dashboard shows which platforms are leaking your data

### 🤖 AI Content Detection
- Upload an image → instant verdict on whether it is AI-generated or real
- Paste any text → detect if it is AI-written
- Confidence score returned for every detection
- Powered by Hugging Face vision models running entirely locally

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI + Uvicorn |
| Frontend | React + Vite + TailwindCSS |
| Database | SQLite + SQLAlchemy ORM |
| Auth | JWT (python-jose) + bcrypt |
| Encryption | AES via Fernet (cryptography) |
| Spam ML | scikit-learn Naive Bayes + TF-IDF |
| AI Detection | Hugging Face Transformers (umm-maybe/AI-image-detector) |
| Rate Limiting | slowapi |
| HTTP Client | Axios |
| Charts | Recharts |
| Extension | Chrome Manifest V3 |

---

## 🗂️ Project Structure

```
AnonMitra/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # SQLite + SQLAlchemy setup
│   ├── models.py             # Database models
│   ├── auth.py               # JWT + bcrypt auth logic
│   ├── routers/
│   │   ├── auth.py           # Register, login, me
│   │   ├── identities.py     # Identity CRUD
│   │   ├── messages.py       # Inbox + spam simulator
│   │   ├── detector.py       # AI image + text detection
│   │   └── analytics.py      # Dashboard analytics
│   ├── ml/
│   │   ├── spam_classifier.py # Rule engine + Naive Bayes
│   │   ├── ai_detector.py    # Hugging Face image detection
│   │   └── spam_simulator.py # Fake spam campaign generator
│   └── utils/
│       ├── encryption.py     # AES Fernet encrypt/decrypt
│       └── identity_gen.py   # Alias/username/password generator
├── frontend/
│   └── src/
│       ├── pages/            # Login, Register, Dashboard, Inbox, Detector, Analytics
│       ├── components/       # Navbar, IdentityCard, MessageCard, RiskBadge, Charts
│       └── api/              # Axios API layer (auth, identities, messages, detector, analytics)
├── extension/                # Chrome Extension (Manifest V3)
├── THREAT_MODEL.md           # Security threat model
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Sarvami/AnonMitra
cd AnonMitra
```

### 2. Backend setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Create `.env` file
Create a file called `.env` inside the `backend` folder:
```
ENCRYPTION_KEY=your_fernet_key_here
```

To generate a new key:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4. Run the backend
```bash
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### 5. Frontend setup
```bash
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user info |

### Identities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/identities` | Get all identities |
| POST | `/api/identities/generate` | Generate new identity |
| DELETE | `/api/identities/{id}` | Delete identity |

### Messages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages/{identity_id}` | Get messages for identity |
| POST | `/api/messages/simulate` | Fire fake spam campaign |
| GET | `/api/messages/` | Get recent messages (for extension) |

### Detector
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/detector/image` | Detect if image is AI-generated |
| POST | `/api/detector/text` | Detect if text is AI-written |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/summary` | Dashboard summary stats |
| GET | `/api/analytics/spam-by-identity` | Spam breakdown by identity |

---

## 🔒 Security Features

- **bcrypt** password hashing with salt
- **JWT** tokens with 24-hour expiry
- **AES/Fernet** encryption for all vault data
- **Rate limiting** — 5 register/min, 10 login/min per IP
- **Pydantic** input validation on all endpoints
- **SQLAlchemy ORM** — no raw SQL, no injection risk
- **CORS** restricted to localhost:5173

See `THREAT_MODEL.md` for full security analysis.

---

## 🧩 Chrome Extension

The AnonMitra Chrome extension lets you generate identities and detect AI content without leaving your browser.

### Load the extension
1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder

---

## 👥 Team

| Name | Role |
|---|---|
| Sarvami Agarwal | Backend & Auth |
| Madiha Kazi | Identity Engine & Vault |
| Shravani Malvade | Spam ML Engine & AI Detection |
| Shravani Wankhade | Frontend, Dashboard & Chrome Extension |

---

## 🔭 Future Scope

- SMTP email forwarding for real alias emails
- Mobile app (React Native)
- Right-click browser detection for images and text
- Video AI detection
- Fine-tuned LLM for AI text detection
- Cloud deployment with PostgreSQL

---

## 📜 License

Built for ProTech 2026 — Symbiosis Institute of Technology, Pune.
Technically co-sponsored by IEEE Maharashtra Section.