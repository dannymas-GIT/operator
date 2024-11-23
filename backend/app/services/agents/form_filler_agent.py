from typing import Dict, Any
import logging
from openai import OpenAI
import json
import os

logger = logging.getLogger(__name__)

class FormFillerAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    async def process_form(self, extracted_data: Dict[str, Any], form_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process extracted data and fill form according to schema
        """
        try:
            logger.info("Processing form with extracted data")
            logger.info(f"Extracted data: {extracted_data}")
            logger.info(f"Form schema: {form_schema}")
            
            # Validate inputs
            if not isinstance(form_schema, dict) or 'fields' not in form_schema:
                raise ValueError("Invalid form schema format")
            
            # Construct prompt for GPT
            prompt = self._construct_prompt(extracted_data, form_schema)
            logger.info(f"Constructed prompt: {prompt}")
            
            # Get completion from GPT
            response = self.client.chat.completions.create(
                model="gpt-4-1106-preview",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You are a form filling assistant. Extract and map data from the provided content to the form fields based on the schema."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse and validate response
            filled_form = json.loads(response.choices[0].message.content)
            logger.info(f"Form filled successfully: {filled_form}")
            return filled_form
            
        except Exception as e:
            logger.error(f"Error in form filling: {str(e)}")
            raise

    def _construct_prompt(self, extracted_data: Dict[str, Any], form_schema: Dict[str, Any]) -> str:
        return f"""
        Given the following extracted data:
        {json.dumps(extracted_data, indent=2)}
        
        Please fill out this form schema:
        {json.dumps(form_schema, indent=2)}
        
        Rules:
        1. Map the extracted data to the appropriate form fields
        2. Follow the types specified in the schema
        3. If a required field can't be filled, use null
        4. Return the response in valid JSON format
        5. Only include fields that are in the schema
        """ 