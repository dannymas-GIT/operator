from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.utils.database import get_db, engine
from app.routes import agents_router, tasks_router
from app.models.base import Base
from app.models.agent import Agent, Task, Conversation  # Import models to register them
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Operator Backend",
    description="Backend API for the Operator AI Agent System",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(
    agents_router,
    prefix="/api/v1",
    tags=["agents"],
    responses={404: {"description": "Not found"}},
)

app.include_router(
    tasks_router,
    prefix="/api/v1",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
)

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint - Check if the API is running
    """
    return {
        "status": "online",
        "service": "Operator Backend",
        "version": "0.1.0"
    }

@app.get("/health", tags=["health"])
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint - Check system components status
    """
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "operational"
    except Exception:
        db_status = "error"

    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "database": db_status,
            "agents": "operational"
        }
    }
