from typing import Optional
from app.models.agent import Agent, AgentType
from .openai_agent import OpenAIAgent
from .claude_agent import ClaudeAgent
from .data_extraction_agent import DataExtractionAgent

class AgentFactory:
    @staticmethod
    def create_agent(agent: Agent) -> Optional[OpenAIAgent | ClaudeAgent | DataExtractionAgent]:
        """Create an appropriate agent implementation based on agent type"""
        if agent.type == AgentType.EXECUTOR:
            return DataExtractionAgent(agent)
        return OpenAIAgent(agent)  # Default fallback 