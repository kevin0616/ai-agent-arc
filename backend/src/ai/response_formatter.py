"""
Response Formatter - Formats AI responses for frontend
"""
from typing import Dict, Any, Optional
from src.ai.prompts import RESPONSE_TEMPLATES


class ResponseFormatter:
    """Formats AI responses for frontend display"""
    
    @staticmethod
    def format_success(
        intent: str,
        amount: Optional[float] = None,
        recipient: Optional[str] = None,
        tx_hash: Optional[str] = None,
        **kwargs
    ) -> str:
        """
        Format successful transaction response
        
        Args:
            intent: Intent type
            amount: Transaction amount
            recipient: Recipient address/name
            tx_hash: Transaction hash
            **kwargs: Additional context
            
        Returns:
            Formatted response string
        """
        template = RESPONSE_TEMPLATES.get(intent, "✅ Transaction completed")
        
        # Format amount
        if amount is not None:
            formatted_amount = f"{amount:.2f}" if amount % 1 != 0 else str(int(amount))
        else:
            formatted_amount = ""
        
        # Format recipient (shorten if too long)
        if recipient and len(recipient) > 20:
            recipient_display = f"{recipient[:10]}...{recipient[-8:]}"
        else:
            recipient_display = recipient or ""
        
        # Format transaction hash (shorten)
        if tx_hash:
            tx_display = f"{tx_hash[:10]}...{tx_hash[-8:]}"
        else:
            tx_display = ""
        
        response = template.format(
            amount=formatted_amount,
            recipient=recipient_display,
            tx_hash=tx_display,
            **kwargs
        )
        
        return response
    
    @staticmethod
    def format_error(error_message: str) -> str:
        """
        Format error response
        
        Args:
            error_message: Error message
            
        Returns:
            Formatted error string
        """
        template = RESPONSE_TEMPLATES.get("error", "❌ Error: {error_message}")
        return template.format(error_message=error_message)
    
    @staticmethod
    def format_balance(balance: float) -> str:
        """
        Format balance response
        
        Args:
            balance: Balance amount
            
        Returns:
            Formatted balance string
        """
        template = RESPONSE_TEMPLATES.get("balance_query", "Your balance: ${balance:.2f} USDC")
        return template.format(balance=balance)
    
    @staticmethod
    def format_help() -> str:
        """
        Format help response
        
        Returns:
            Help message
        """
        return RESPONSE_TEMPLATES.get("help", "I can help you with payments!")

