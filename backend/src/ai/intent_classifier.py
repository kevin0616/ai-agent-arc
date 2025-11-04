"""
Intent Classifier - Classifies user messages into payment intents
"""
from enum import Enum
from typing import Optional
from openai import OpenAI


class Intent(Enum):
    """Intent types for user commands"""
    SIMPLE_PAYMENT = "simple_payment"
    SPLIT_PAYMENT = "split_payment"
    CREATE_ESCROW = "create_escrow"
    RELEASE_ESCROW = "release_escrow"
    CREATE_SUBSCRIPTION = "subscription"
    CANCEL_SUBSCRIPTION = "cancel_subscription"
    BALANCE_QUERY = "balance_query"
    TRANSACTION_HISTORY = "history"
    DEFI_INVEST = "defi_invest"
    HELP = "help"
    UNKNOWN = "unknown"


class IntentClassifier:
    """Classifies user intent from natural language"""
    
    def __init__(self, openai_api_key: Optional[str] = None):
        """Initialize intent classifier with OpenAI API key"""
        if openai_api_key:
            self.client = OpenAI(api_key=openai_api_key)
        else:
            # Fallback to environment variable
            import os
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OpenAI API key is required")
            self.client = OpenAI(api_key=api_key)
    
    async def classify(self, user_message: str) -> Intent:
        """
        Classify user intent using GPT-4
        
        Args:
            user_message: User's message/text command
            
        Returns:
            Intent enum value
        """
        system_prompt = """You are an intent classifier for a payment AI agent.
Classify the user's message into one of these intents:
- simple_payment: Send money to one person (e.g., "Send $50 to Alice")
- split_payment: Split bill between multiple people (e.g., "Split $300 4 ways")
- create_escrow: Lock money with conditions (e.g., "Escrow $2000")
- release_escrow: Release locked money
- subscription: Set up recurring payment (e.g., "Pay $15/month")
- cancel_subscription: Cancel recurring payment
- balance_query: Check USDC balance (e.g., "Check my balance")
- history: View transaction history
- defi_invest: Invest in DeFi protocols
- help: Ask for help
- unknown: Cannot determine intent

Respond with ONLY the intent name (lowercase, no punctuation)."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",  # Using mini for faster responses
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                max_tokens=50
            )
            
            intent_str = response.choices[0].message.content.strip().lower()
            
            # Remove any punctuation
            intent_str = intent_str.replace(".", "").replace(",", "").replace("!", "").replace("?", "")
            
            try:
                return Intent(intent_str)
            except ValueError:
                # Try to match similar intents
                if "payment" in intent_str or "send" in intent_str or "transfer" in intent_str:
                    return Intent.SIMPLE_PAYMENT
                elif "split" in intent_str:
                    return Intent.SPLIT_PAYMENT
                elif "escrow" in intent_str:
                    return Intent.CREATE_ESCROW
                elif "balance" in intent_str or "check" in intent_str:
                    return Intent.BALANCE_QUERY
                elif "history" in intent_str or "transaction" in intent_str:
                    return Intent.TRANSACTION_HISTORY
                elif "help" in intent_str:
                    return Intent.HELP
                else:
                    return Intent.UNKNOWN
                    
        except Exception as e:
            print(f"Error classifying intent: {e}")
            return Intent.UNKNOWN

