"""
Main AI Agent - Orchestrates intent classification, entity extraction, and execution
"""
from typing import Dict, Any, Optional
from src.ai.intent_classifier import IntentClassifier, Intent
from src.ai.entity_extractor import EntityExtractor
from src.ai.safety import SafetyChecker
from src.ai.response_formatter import ResponseFormatter


class AIAgent:
    """Main AI agent that processes user messages and executes actions"""
    
    def __init__(
        self,
        intent_classifier: Optional[IntentClassifier] = None,
        entity_extractor: Optional[EntityExtractor] = None,
        safety_checker: Optional[SafetyChecker] = None
    ):
        """Initialize AI agent"""
        self.intent_classifier = intent_classifier or IntentClassifier()
        self.entity_extractor = entity_extractor or EntityExtractor()
        self.safety_checker = safety_checker or SafetyChecker()
        self.response_formatter = ResponseFormatter()
    
    async def process_message(
        self,
        user_message: str,
        user_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process user message and return response
        
        Args:
            user_message: User's message/text command
            user_address: User's wallet address (optional)
            
        Returns:
            Dictionary with intent, response, and status
        """
        try:
            # 1. Classify intent
            intent = await self.intent_classifier.classify(user_message)
            
            # 2. Extract entities
            entities = await self.entity_extractor.extract(user_message, intent.value)
            
            # 3. Prepare response based on intent
            response_data = {
                "intent": intent.value,
                "entities": entities,
                "response": "",
                "status": "success"
            }
            
            # Handle different intents
            if intent == Intent.HELP:
                response_data["response"] = self.response_formatter.format_help()
            
            elif intent == Intent.BALANCE_QUERY:
                # This will be handled by the API route that calls blockchain
                response_data["response"] = "Checking balance..."
            
            elif intent == Intent.TRANSACTION_HISTORY:
                # This will be handled by the API route
                response_data["response"] = "Fetching transaction history..."
            
            elif intent == Intent.SIMPLE_PAYMENT:
                amount = entities.get("amount")
                recipient = entities.get("recipient")
                
                if not amount or not recipient:
                    response_data["response"] = self.response_formatter.format_error(
                        "Missing amount or recipient. Please specify both."
                    )
                    response_data["status"] = "error"
                elif user_address:
                    # Check safety limits
                    is_valid, error_msg = self.safety_checker.check_transaction_limits(
                        amount, user_address
                    )
                    if not is_valid:
                        response_data["response"] = self.response_formatter.format_error(error_msg)
                        response_data["status"] = "error"
                    else:
                        # Ready for execution
                        response_data["response"] = f"Ready to send ${amount:.2f} to {recipient}"
            
            elif intent == Intent.SPLIT_PAYMENT:
                amount = entities.get("amount")
                num_people = entities.get("num_people")
                
                if not amount or not num_people:
                    response_data["response"] = self.response_formatter.format_error(
                        "Missing amount or number of people. Please specify both."
                    )
                    response_data["status"] = "error"
                elif user_address:
                    per_person = amount / num_people
                    is_valid, error_msg = self.safety_checker.check_transaction_limits(
                        amount, user_address
                    )
                    if not is_valid:
                        response_data["response"] = self.response_formatter.format_error(error_msg)
                        response_data["status"] = "error"
                    else:
                        response_data["response"] = f"Ready to split ${amount:.2f} between {num_people} people (${per_person:.2f} each)"
            
            else:
                response_data["response"] = "I understand your request. Processing..."
            
            return response_data
            
        except Exception as e:
            return {
                "intent": "unknown",
                "entities": {},
                "response": self.response_formatter.format_error(str(e)),
                "status": "error"
            }

