"""
Entity Extractor - Extracts amounts, addresses, and other entities from user messages
"""
from typing import Dict, Any, Optional
from openai import OpenAI
import json


class EntityExtractor:
    """Extracts entities from user messages"""
    
    def __init__(self, openai_api_key: Optional[str] = None):
        """Initialize entity extractor with OpenAI API key"""
        if openai_api_key:
            self.client = OpenAI(api_key=openai_api_key)
        else:
            import os
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OpenAI API key is required")
            self.client = OpenAI(api_key=api_key)
    
    async def extract(self, user_message: str, intent: str) -> Dict[str, Any]:
        """
        Extract entities from user message based on intent
        
        Args:
            user_message: User's message/text command
            intent: Intent type (from Intent enum)
            
        Returns:
            Dictionary with extracted entities
        """
        system_prompt = f"""Extract entities from the user's payment command.
Intent: {intent}

Return a JSON object with these fields (only include applicable fields):
- amount: dollar amount (number)
- recipient: recipient name/address/email (string)
- recipients: list of recipients for split payments (array of strings)
- num_people: number of people to split between (number)
- frequency: for subscriptions (daily/weekly/monthly)
- duration: escrow duration in days (number)
- description: payment description/memo (string)
- milestone: milestone description for escrow (string)

Examples:
Input: "Send $50 to alice@email.com"
Output: {{"amount": 50, "recipient": "alice@email.com"}}

Input: "Split $300 between 4 people"
Output: {{"amount": 300, "num_people": 4}}

Input: "Escrow $2000 for freelance project"
Output: {{"amount": 2000, "description": "freelance project"}}

Return ONLY valid JSON, no additional text."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            entities = json.loads(content)
            
            return entities
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from entity extractor: {e}")
            return {}
        except Exception as e:
            print(f"Error extracting entities: {e}")
            return {}

