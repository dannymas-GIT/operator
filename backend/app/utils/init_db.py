from app.models.base import Base
from app.models.agent import Agent, Task, Conversation
from app.utils.database import engine

def init_db():
    """Initialize the database tables"""
    Base.metadata.create_all(bind=engine)

def drop_db():
    """Drop all database tables"""
    Base.metadata.drop_all(bind=engine) 