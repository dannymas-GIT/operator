from typing import Dict, Any, Optional
import aiohttp
from bs4 import BeautifulSoup
from app.config.settings import settings
from openai import AsyncOpenAI
import json

class DataExtractionAgent:
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API key not found")
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4-1106-preview"

    async def fetch_url_content(self, url: str) -> Dict[str, Any]:
        """Fetch content from URL and return both HTML and text versions"""
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise Exception(f"Error code: {response.status}")
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()

                return {
                    "html": html,
                    "text": soup.get_text(separator='\n', strip=True)
                }

    async def process_task(self, url: str) -> Dict[str, Any]:
        """Process a data extraction task"""
        try:
            # Fetch content
            content = await self.fetch_url_content(url)
            
            # Prepare system prompt
            system_prompt = """You are a Data Extraction Agent specialized in:
            1. Web scraping and data collection
            2. Information compilation from multiple sources
            3. Data cleaning and structuring
            4. Pattern recognition in unstructured data
            
            Extract key information from the content and return a JSON object with the following structure:
            {
                "main_content": "The main textual content",
                "metadata": {
                    "title": "Page title",
                    "author": "Author if available",
                    "date": "Publication date if available",
                    "url": "Source URL"
                },
                "structured_data": {
                    "key_points": ["array of key points"],
                    "categories": ["array of categories"],
                    "related_topics": ["array of related topics"]
                }
            }
            """
            
            # Get AI response
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": f"Please analyze this content and return a JSON response: {content['text']}"
                    }
                ],
                temperature=0.3,
                response_format={ "type": "json_object" }
            )

            # Parse AI response
            result = json.loads(response.choices[0].message.content)
            
            # Add original HTML if needed
            result["html_content"] = content["html"]
            
            return result

        except Exception as e:
            raise Exception(f"Error processing URL {url}: {str(e)}") 