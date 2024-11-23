from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.database import get_db
from app.models.agent import Task
from pydantic import BaseModel

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: int = 0
    agent_id: int

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: int
    agent_id: int

    class Config:
        from_attributes = True

@router.post("/tasks/", response_model=TaskResponse, tags=["tasks"])
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task with the following parameters:
    - **title**: Required task title
    - **description**: Optional task description
    - **priority**: Task priority (default: 0)
    - **agent_id**: ID of the agent to assign the task to
    """
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task 