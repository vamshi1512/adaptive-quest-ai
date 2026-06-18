# Adaptive Quest AI – AI-Powered Learning Game Prototype

**Live demo:** https://vamshi1512.github.io/adaptive-quest-ai/

> Note: The GitHub Pages demo runs the frontend build. Backend-powered gameplay/API flows require running the FastAPI backend locally.

Adaptive Quest AI is a complete, portfolio-ready interactive learning game prototype designed for corporate training. It combines narrative-based gameplay (quests) with real-time adaptive difficulty scaling and comprehensive KPI telemetry dashboards. 

This project was built to demonstrate game-based learning theories, AI-assisted workflows, and playtest evaluation pipelines suitable for an **AI Games Internship** application.

---

## Why This Project Exists

Traditional corporate training courses (e.g. cybersecurity compliance, data privacy audits) often fail due to low learner engagement, lack of difficulty calibration, and simplistic metrics. Adaptive Quest AI solves these challenges by:
1. **Calibrating difficulty dynamically** to keep players in the **Flow State** (mitigating frustration and boredom).
2. **Transforming static quizzes into story-driven levels** (improving long-term recall).
3. **Orchestrating an AI provider pipeline** to generate custom topic questions on the fly.
4. **Tracking behavioral learning KPIs** (completion rates, session lengths, repeat plays, failed subtopics) to demonstrate training efficacy.

---

## Tech Stack

- **Frontend**: React (SPA view routing), TypeScript, Vite, Tailwind CSS v4, Recharts (dashboard visualization), LocalStorage (playtester profile persistence).
- **Backend**: Python 3.14+, FastAPI, Pydantic, SQLite (via SQLAlchemy ORM).
- **Testing**: Vitest (frontend utility tests), Pytest (backend gameplay and API tests).

---

## Architecture & Data Flow

```
                     ┌──────────────────────────────┐
                     │         User Browser         │
                     └──────────────┬───────────────┘
                                    │ HTTP / JSON
                                    ▼
                     ┌──────────────────────────────┐
                     │    React Vite (Port 3000)    │
                     └──────────────┬───────────────┘
                                    │ Proxy Routing
                                    ▼
                     ┌──────────────────────────────┐
                     │    FastAPI App (Port 8000)   │
                     └──────┬───────────────┬───────┘
                            │               │
                            ▼               ▼
                     ┌─────────────┐ ┌──────────────┐
                     │ Game Engine │ │ SQLite DB    │
                     │  (Adaptive) │ │ (Telemetry) │
                     └──────┬──────┘ └──────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ AI Service  │
                     │ (Mock/LLM)  │
                     └─────────────┘
```

- **Frontend Architecture**: A modular React structure utilizing dynamic view-state swappers (`App.tsx`) to guarantee fast, bug-free transitions.
- **Game Engine**: Updates scores, streaks, and lives in real-time, adapting difficulty curves (Difficulties 1–5) based on success or error streaks.
- **AI Abstraction**: Located in `backend/app/services/ai_service.py`. Features a clean developer interface to easily swap out the mock generator for OpenAI's GPT-4o or Google's Gemini models using Structured Outputs.

---

## KPI Telemetry Framework

Adaptive Quest AI measures and aggregates metrics critical for corporate instructional designers:
- **Completion Rate**: Total sessions completed vs started. Targets engagement quality.
- **Session Length**: Tracks duration of quests. Optimized for micro-learning (2-4 minutes).
- **Replay Count**: Measures reinforcement. Tracks when a player chooses to replay a topic.
- **Average Accuracy**: Tracks correct options chosen. Target range is 70%-85%.
- **Failed Sub-Topics**: Logs and counts errors to flag specific areas where employees need offline coaching.

---

## Setup & Run Instructions

Ensure you have **Python 3** and **NodeJS (v18+)** installed.

### 1. Run the Backend API

#### Mac / Linux:
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies (incorporating auto ABI3 compatibility flag for Python 3.14+)
export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
pip install -r requirements.txt

# Start the FastAPI dev server
python app/main.py
```

#### Windows:
```cmd
:: Navigate to the backend directory
cd backend

:: Create a virtual environment
python -m venv venv

:: Activate the virtual environment
venv\Scripts\activate

:: Install dependencies
pip install -r requirements.txt

:: Start the FastAPI dev server
python app/main.py
```

*The API will be available at `http://127.0.0.1:8000`. The SQLite database will be initialized and pre-seeded automatically with 15 simulated historical sessions and feedback records on startup so your dashboard charts are pre-populated!*

---

### 2. Run the Frontend Client

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the Vite development server (configured to run on port 3000)
npm run dev
```

*Open your browser and navigate to `http://localhost:3000` to play!*

---

## Running Test Suites

### Backend Tests (Pytest)
From the `backend/` directory with the virtual environment activated:
```bash
pytest
```
*Runs 8 integration tests validating session initialization, correct-streak difficulty increases, incorrect-streak difficulty decreases, lives reduction, and game over states.*

### Frontend Tests (Vitest)
From the `frontend/` directory:
```bash
npm run test
```
*Runs Vitest suite checking the duration formatters, score scaling, and difficulty label clamps.*

---

## Future Improvements

1. **LLM Connection**: Replace the `AIService` methods with real API calls using:
   ```python
   # Example OpenAI implementation snippet
   response = client.beta.chat.completions.parse(
       model="gpt-4o-mini",
       messages=[{"role": "user", "content": f"Generate question for: {topic}"}],
       response_format=Question
   )
   ```
2. **Audio/VFX Assets**: Integrate short chiptune audios on submit (e.g. success/fail alerts) to heighten sensory feedback.
3. **Multi-Quest Campaigns**: Group multiple topics into sequential certification paths.

---

## Resume Alignment (Internship Ready)

**Adaptive Quest AI – AI-Powered Learning Game Prototype**
- Built an AI-assisted learning game prototype using React, TypeScript, FastAPI, and adaptive difficulty logic to personalize quiz-based learning sessions.
- Implemented KPI tracking for completion rate, session length, replay count, accuracy, and difficulty progression to evaluate learning-game performance.
- Designed a playtest workflow with structured user feedback, learning summaries, and analytics dashboards to support data-driven iteration.
- Created a mock AI content-generation pipeline with clean provider abstraction for future LLM integration and AI-agent-based game design workflows.
