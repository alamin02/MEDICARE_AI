# MedICARE AI

An AI-powered multimodal healthcare assistant built with a multimodal Retrieval-Augmented Generation (RAG) architecture.

## Project Objectives
- Multimodal healthcare assistance supporting text, voice, documents, and medical imaging.
- Bilingual support in English and Bangla.
- Grounded medical Q&A with verified knowledge retrieval and agentic workflows.
- Clinical review escalation and strict safety boundaries.

## Technology Stack
- Frontend: React.js, Vite, Tailwind CSS, TypeScript
- Backend: Python, FastAPI, Pydantic
- AI & RAG: LangGraph, LlamaIndex, Multimodal LLM Integration, OCR, STT/TTS
- Databases: PostgreSQL, Qdrant Vector Database
- DevOps & Cloud: Docker, Docker Compose, GitHub Actions, Vercel, Render

## Repository Structure
The repository is modularly structured across client, server, ml, database, knowledge_base, storage, tests, docs, and deployment directories.

## Team Collaboration Workflow
- Central repository model with branch protection on main and development.
- Feature branching: feature/<domain>-<task>.
- Mandatory peer reviews and CI checks prior to merging.

## Planned Development Phases
1. Phase 1: Repository setup, scaffolding, and CI/CD pipelines.
2. Phase 2: Core backend API, database schemas, and frontend UI layouts.
3. Phase 3: Multimodal RAG pipeline, knowledge ingestion, and agent workflows.
4. Phase 4: Integration testing, medical evaluation, and staging deployment.

## Medical Safety Statement
MedICARE AI is an assistive technology and does not provide definitive medical diagnoses, prescriptions, or replace certified clinical judgment. All health guidance must be verified by licensed healthcare professionals.
