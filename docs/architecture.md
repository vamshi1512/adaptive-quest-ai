# Architecture & Data Flow - Adaptive Quest AI

Adaptive Quest AI is organized as a lightweight monorepo separating a React SPA frontend and a FastAPI backend.

## 1. Monorepo Layout

```
adaptive-quest-ai/
  ├── docs/                      # Methodology, playtest, and KPI frameworks
  ├── backend/                   # FastAPI, Uvicorn, SQLAlchemy
  │    ├── requirements.txt      # Python package specs
  │    ├── pytest.ini            # Pytest configuration
  │    └── app/
  │         ├── main.py          # FastAPI application initialization
  │         ├── models.py        # Pydantic schemas (requests/responses)
  │         ├── routes/          # API route definitions
  │         ├── services/        # Business logic (AI engine, Game rules)
  │         ├── storage/         # Database connectors (SQLite setup)
  │         └── tests/           # Integration & Unit test files
  └── frontend/                  # React, Vite, TS, TailwindCSS v4
       ├── package.json          # Node modules and scripts configuration
       ├── index.html            # Web template bindings
       ├── vite.config.ts        # Vite configuration & proxy definitions
       └── src/
            ├── App.tsx          # Client views routers & parent state
            ├── index.css        # CSS styles and Google font imports
            ├── components/      # UI components (ProgressBar, MetricCard, Navbar)
            ├── pages/           # Client views pages (Dashboard, Play, Results)
            ├── services/        # Fetch API caller to backend
            ├── types/           # TS definitions matching backend schemas
            └── tests/           # Vitest utility unit test files
```

## 2. Database Models & Schema (SQLite)

We use SQLAlchemy ORM to build three core relational database tables:
- **DBSession**: Tracks playtester sessions, usernames, start/end dates, streaks, total questions, correct count, and `difficulty_log` (a comma-separated string like `1,1,2,3,2` recording difficulty progression).
- **DBAnswer**: An audit log of every question answered, the selected option index, correct option, and whether it was correct. This feeds the "Weak Areas" aggregator.
- **DBFeedback**: Stores playtester responses to surveys (fun ratings, comments).

## 3. API Endpoints

| Method | Endpoint | Description | Payload | Return |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/health` | Server status checks | None | Status dictionary |
| **POST** | `/api/session/start` | Creates session & starts quest | Username, Topic | `SessionStartResponse` |
| **POST** | `/api/question/generate` | Generates a specific question | Session ID / Custom topic | `Question` |
| **POST** | `/api/answer/submit` | Evaluates answer and scales difficulty | Session, Answer index | `AnswerResult` |
| **POST** | `/api/session/complete` | Forces session completion | Session ID | Status dictionary |
| **GET** | `/api/analytics/summary` | Compiles dashboard statistics | None | `KPISummary` |
| **POST** | `/api/feedback` | Saves playtest feedback survey | Feedback schema | Status dictionary |

## 4. Frontend States & View Swapping

To avoid router loading issues and complex path configs in static folders, we use a parent `App.tsx` state router:
- **`currentView`**: Tracks current screen (`landing`, `topic-selection`, `game-play`, `results`, `dashboard`, `playtest-feedback`, `methodology`).
- **`activeSession`**: Holds session details during gameplay.
- **`gameResult`**: Stores final score, accuracy, and AI coaching text to populate the results screen.
- **`error`**: Displays a banner at the top if any API calls fail (e.g. backend offline).
