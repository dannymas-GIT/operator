from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from app.utils.database import get_db
from app.models.agent import Agent, Task, Conversation, AgentType, AgentStatus
from app.services.agents.agent_factory import AgentFactory
from pydantic import BaseModel
from datetime import datetime
import logging
from app.services.agents.data_extraction_agent import DataExtractionAgent

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class AgentCreate(BaseModel):
    name: str
    description: str | None = None
    type: AgentType
    capabilities: Dict[str, bool] = {}
    config: dict = {}

class AgentResponse(BaseModel):
    id: int
    name: str
    description: str | None
    type: AgentType
    status: AgentStatus
    capabilities: dict
    config: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AgentAction(BaseModel):
    action: str
    parameters: dict = {}

class DataExtractionRequest(BaseModel):
    urls: List[str]
    data_points: Optional[List[str]] = None
    output_format: Optional[str] = "json"
    preserve_html: Optional[bool] = False

@router.post("/agents/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    """
    Create a new agent with specified capabilities
    """
    try:
        logger.info(f"Creating agent: {agent.model_dump()}")
        
        # Create agent instance
        agent_data = agent.model_dump()
        if not agent_data.get('capabilities'):
            agent_data['capabilities'] = {}
        if not agent_data.get('config'):
            agent_data['config'] = {}
            
        db_agent = Agent(**agent_data)
        
        # Add to database
        db.add(db_agent)
        db.commit()
        db.refresh(db_agent)
        
        logger.info(f"Agent created successfully with ID: {db_agent.id}")
        return db_agent
        
    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating agent: {str(e)}"
        )

@router.get("/agents/", response_model=List[AgentResponse])
async def list_agents(
    type: AgentType | None = None,
    status: AgentStatus | None = None,
    db: Session = Depends(get_db)
):
    """
    List all agents with optional filtering by type and status
    """
    query = db.query(Agent)
    if type:
        query = query.filter(Agent.type == type)
    if status:
        query = query.filter(Agent.status == status)
    return query.all()

@router.get("/agents/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific agent
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.post("/agents/{agent_id}/action")
async def execute_agent_action(
    agent_id: int,
    action: AgentAction,
    db: Session = Depends(get_db)
):
    """
    Execute a specific action with an agent
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Get appropriate agent implementation
    agent_impl = AgentFactory.create_agent(agent)
    if not agent_impl:
        raise HTTPException(status_code=400, detail="Agent type not implemented")
    
    try:
        # Update agent status
        agent.status = AgentStatus.BUSY
        db.commit()
        
        # Execute action
        result = await agent_impl.process_task(action.parameters.get("input", ""))
        
        # Update agent status
        agent.status = AgentStatus.IDLE
        db.commit()
        
        return {"status": "success", "result": result}
    except Exception as e:
        agent.status = AgentStatus.ERROR
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/agents/{agent_id}")
async def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    """
    Delete an agent and all associated tasks and conversations
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return {"status": "success", "message": f"Agent {agent_id} deleted"}

@router.get("/agents/{agent_id}/tasks")
async def get_agent_tasks(agent_id: int, db: Session = Depends(get_db)):
    """
    Get all tasks associated with an agent
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent.tasks 

@router.post("/data-extraction/process")
async def process_data_extraction(request: DataExtractionRequest):
    try:
        agent = DataExtractionAgent()
        
        # Process each URL
        results = []
        for url in request.urls:
            result = await agent.process_task(url)
            results.append(result)

        # Format response based on output format
        response = {
            "main_content": "\n\n".join([r.get("main_content", "") for r in results]),
            "metadata": {
                "urls": request.urls,
                "data_points": request.data_points,
                "timestamp": datetime.now().isoformat()
            },
            "structured_data": results
        }

        if request.preserve_html:
            response["html_content"] = "\n".join([r.get("html_content", "") for r in results])

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))