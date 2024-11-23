from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Create database engine
try:
    engine = create_engine(settings.DATABASE_URL, echo=True)
    logger.info(f"Database connection established: {settings.DATABASE_URL}")
except Exception as e:
    logger.error(f"Error connecting to database: {str(e)}")
    raise

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 