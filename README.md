# MedICARE AI — Intelligent Healthcare. Accessible Everywhere.

An AI-powered multimodal healthcare platform connecting patients with accessible healthcare services, symptom understanding, injury photo triage, emergency first-aid protocols, and verified clinical doctor discovery.

---

## 1. Project Overview

MedICARE AI bridges the critical gap between early patient symptom uncertainty and timely professional medical intervention. Built with a multimodal Retrieval-Augmented Generation (RAG) architecture, the platform provides bilingual (English and বাংলা) medical guidance, photographic injury analysis, real-time emergency escalation, and seamless doctor appointment reservation.

### Core Objectives
- **Multimodal Visual Triage**: Photographic inspection of superficial cuts, burns, sprains, and abrasions with immediate safe first aid and danger sign flags.
- **Bilingual Voice & Text Interaction**: Real-time symptom assistance supporting both English and native Bengali (বাংলা).
- **Clinical Safety Boundaries**: Strict guardrails preventing autonomous prescriptions or definitive diagnostic assertions without clinician review.
- **Three Independent Role Portals**: Dedicated workspaces for Patients, Clinicians, and Healthcare Operations Administrators.
- **Double-Booking Protected Appointments**: Transactional locks ensuring verified clinical calendar availability.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Backend**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy, Alembic, SQLite / PostgreSQL
- **AI & RAG**: LangGraph Supervisor Agent, LlamaIndex-compatible RAG, Qdrant Vector DB, Vision Models
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD
- **Target Hosting**: Vercel (Frontend), Render (Backend), Managed PostgreSQL, Qdrant Cloud

---

## 3. Demo Accounts & Synthetic Data

All records in this demonstration repository are synthetic (`is_demo = true`) and entirely fictional to guarantee patient privacy and compliance.

### Instant 1-Click Demo Login Credentials:
- **Patient Workspace**:
  - Email: `patient.demo@example.com`
  - Password: `DemoPatient123!`
  - Role: `PATIENT` (Rahim Chowdhury)
- **Doctor Workspace**:
  - Email: `doctor.demo@example.com`
  - Password: `DemoDoctor123!`
  - Role: `DOCTOR` (Dr. Nusrat Jahan, BMDC-DEMO-48291, Cardiology)
- **Admin Workspace**:
  - Email: `admin.demo@example.com`
  - Password: `DemoAdmin123!`
  - Role: `ADMIN` (Healthcare Operations Admin)

---

## 4. Repository Structure

```
MediCARE-AI/
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE/
│   ├── CODEOWNERS
│   └── CONTRIBUTING.md
├── client/
│   ├── src/
│   │   ├── components/ (common, medical, chat, dashboard)
│   │   ├── contexts/ (AuthContext)
│   │   ├── pages/ (LandingPage, LoginPage, PatientDashboard, DoctorDashboard, AdminDashboard)
│   │   ├── services/ (syntheticData)
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── app/
│   │   ├── api/routes/ (auth, appointments, ai, doctors, hospitals, admin, health)
│   │   ├── core/ (config, security, database)
│   │   ├── models/ (18 normalized SQLAlchemy tables)
│   │   ├── schemas/ (Pydantic v2 validation models)
│   │   └── main.py
│   └── requirements.txt
├── ml/
│   ├── agents/ (supervisor, medical_agent)
│   ├── multimodal/ (injury_detector)
│   └── rag/ (retrieval, chunking, embeddings)
├── database/
│   └── seed/ (generate_synthetic_data.py, seed_demo.py, reset_demo.py)
├── tests/
│   ├── frontend/ (test_frontend.js)
│   ├── backend/ (test_backend.py)
│   └── security/ (test_security.py)
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 5. Local Setup and Installation

### Frontend Setup
```bash
cd client
npm install
npm run build
npm run dev
# Running at http://localhost:5173
```

### Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Running at http://localhost:8000
# OpenAPI Docs: http://localhost:8000/docs
```

### Synthetic Data Seeding & Safe Reset
```bash
# Generate deterministic synthetic data
python database/seed/generate_synthetic_data.py

# Seed database with demo accounts
python database/seed/seed_demo.py

# Safe reset (selectively wipes only records where is_demo = true)
python database/seed/reset_demo.py
```

---

## 6. Testing

### Run Automated Frontend Tests
```bash
node tests/frontend/test_frontend.js
```

### Run Automated Backend & Security Tests
```bash
python -m unittest tests/backend/test_backend.py
python -m unittest tests/security/test_security.py
```

---

## 7. Docker Deployment

```bash
docker-compose up --build
```
- Client and API: `http://localhost:8000`
- Database: PostgreSQL on `5432`
- Vector DB: Qdrant on `6333`

---

## 8. Medical Safety Statement

> **CRITICAL CLINICAL NOTICE**: MedICARE AI is an assistive healthcare technology designed for educational support, early symptom understanding, and triage guidance. It does NOT provide autonomous medical diagnoses, does NOT prescribe medications independently, and does NOT replace licensed clinician evaluation. In acute life-threatening situations (e.g. chest pain, breathing cessation, massive blood loss, loss of consciousness), immediately contact national emergency services (999 in Bangladesh / 911 internationally).
