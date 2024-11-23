from typing import Dict, Any
from app.models.agent import Agent
from openai import AsyncOpenAI
from app.config.settings import settings
import logging
import json
import aiohttp
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class DataExtractionAgent:
    def __init__(self, agent: Agent):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API key not found in environment")
            
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.agent = agent
        self.model = "gpt-4-1106-preview"
        
    async def fetch_url_content(self, url: str) -> str:
        """Fetch content from URL"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    # Remove script and style elements
                    for script in soup(["script", "style"]):
                        script.decompose()
                    text = soup.get_text()
                    # Clean up whitespace
                    lines = (line.strip() for line in text.splitlines())
                    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                    text = ' '.join(chunk for chunk in chunks if chunk)
                    return text
        except Exception as e:
            logger.error(f"Error fetching URL {url}: {str(e)}")
            raise Exception(f"Error fetching URL: {str(e)}")
        
    async def process_task(self, task_input: str) -> str:
        """Process a data extraction task"""
        try:
            # Extract content if URL provided
            content = task_input
            if task_input.startswith(("http://", "https://")):
                logger.info(f"Fetching content from URL: {task_input}")
                content = await self.fetch_url_content(task_input)
                content = f"Content extracted from URL {task_input}:\n\n{content}"
            
            system_prompt = """You are a Data Extraction Agent specialized in:
            1. Web scraping and data collection
            2. Information compilation from multiple sources
            3. Data cleaning and structuring
            4. Pattern recognition in unstructured data
            
            When given content:
            1. Identify key data points
            2. Extract relevant information
            3. Return data in a structured JSON format with:
               - main_content: The primary content or summary
               - metadata: Any relevant metadata (dates, authors, etc.)
               - structured_data: Key information as key-value pairs
            """
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                temperature=0.3,
                response_format={ "type": "json_object" }
            )
            
            result = response.choices[0].message.content
            return result
            
        except Exception as e:
            logger.error(f"Data extraction error: {str(e)}")
            raise Exception(f"Data extraction error: {str(e)}") 