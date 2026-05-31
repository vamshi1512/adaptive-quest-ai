import sys
import traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.storage.db import Base, DBSession, DBAnswer, DBFeedback
from app.services.analytics_service import AnalyticsService

# Initialize SQLite database
engine = create_engine("sqlite:///./adaptive_quest.db")
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

try:
    print("Testing analytics service...")
    service = AnalyticsService(db)
    summary = service.get_kpi_summary()
    print("KPI summary success!")
    print(summary.dict())
except Exception as e:
    print("Error during analytics calculation:", e)
    traceback.print_exc()
finally:
    db.close()
