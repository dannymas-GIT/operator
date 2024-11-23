from anthropic import Anthropic
from app.config.settings import settings
from app.models.agent import Agent, AgentType

class ClaudeAgent:
    def __init__(self, agent: Agent):
        self.anthropic = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.agent = agent
        self.model = "claude-3-opus-20240229"  # Latest Claude model
        
    async def process_task(self, task_input: str) -> str:
        """Process a task using Claude's capabilities"""
        message = await self.anthropic.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": self._prepare_prompt(task_input)
            }]
        )
        return message.content

    def _prepare_prompt(self, task_input: str) -> str:
        """Prepare the prompt based on agent type"""
        if self.agent.type == AgentType.RESEARCHER:
            return f"""You are a research agent. Your task is to:
            1. Analyze the following topic
            2. Provide detailed insights
            3. Support with credible information
            
            Topic: {task_input}
            """
            
        elif self.agent.type == AgentType.PLANNER:
            return f"""You are a planning agent. Your task is to:
            1. Break down the following objective
            2. Create detailed action steps
            3. Identify potential challenges
            
            Objective: {task_input}
            """
            
        return task_input  # Default case 