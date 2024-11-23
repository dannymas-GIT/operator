from typing import Dict, Any
from app.models.agent import Agent
from openai import AsyncOpenAI
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class OpenAIAgent:
    def __init__(self, agent: Agent):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API key not found in environment")
            
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.agent = agent
        self.model = "gpt-4-1106-preview"  # Latest GPT-4 Turbo
        
    async def process_task(self, task_input: str) -> str:
        """Process a task using OpenAI's capabilities"""
        try:
            logger.info(f"Processing task with OpenAI: {task_input[:100]}...")
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt()
                    },
                    {
                        "role": "user",
                        "content": task_input
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            result = response.choices[0].message.content
            logger.info(f"Task processed successfully: {result[:100]}...")
            return result
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"OpenAI API error: {str(e)}")
            
    def _get_system_prompt(self) -> str:
        """Generate system prompt based on agent type and capabilities"""
        base_prompt = f"You are a {self.agent.type} agent with the following capabilities:\n"
        capabilities = "\n".join([f"- {k}" for k, v in self.agent.capabilities.items() if v])
        
        type_specific = {
            "assistant": "Assist users with their queries and tasks.",
            "researcher": "Research and analyze information from various sources.",
            "executor": "Execute specific tasks and provide detailed results.",
            "planner": "Plan and break down complex tasks into manageable steps."
        }
        
        return f"{base_prompt}{capabilities}\n\nYour role: {type_specific.get(self.agent.type, '')}" 