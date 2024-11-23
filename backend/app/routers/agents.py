from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict
from ..models.agent import Agent
from ..services.agents import AgentService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[Agent])
async def get_agents():
    try:
        return await AgentService.get_all_agents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{agent_id}/action", response_model=Dict)
async def execute_agent_action(
    agent_id: int,
    action_data: Dict = Body(...)
):
    try:
        logger.info(f"Executing action for agent {agent_id}: {action_data}")
        result = await AgentService.execute_action(agent_id, action_data)
        logger.info(f"Action result: {result}")
        return {"result": result}
    except Exception as e:
        logger.error(f"Error executing action: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 