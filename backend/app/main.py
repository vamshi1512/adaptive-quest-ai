import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.storage.db import init_db
from app.routes import session, analytics

# Initialize app
app = FastAPI(
    title="Adaptive Quest AI API",
    description="Backend services for the AI-Powered Adaptive Learning Game Prototype.",
    version="1.0.0"
)

# Set up CORS so the frontend React application can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev environments. In production, narrow this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database (and seed if empty)
@app.on_event("startup")
def startup_event():
    print("Starting Adaptive Quest AI Backend...")
    init_db()

# Mount routers
app.include_router(session.router)
app.include_router(analytics.router)

# Basic Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Adaptive Quest AI Engine",
        "database": "SQLite connected"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
