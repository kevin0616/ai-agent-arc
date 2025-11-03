"""
Validator - Validates input data
"""
from typing import Optional
from web3 import Web3


class Validator:
    """Utility for validating input data"""
    
    @staticmethod
    def validate_address(address: str) -> bool:
        """
        Validate Ethereum address
        
        Args:
            address: Address to validate
            
        Returns:
            True if valid
        """
        try:
            return Web3.is_address(address)
        except:
            return False
    
    @staticmethod
    def validate_amount(amount: float, min_amount: float = 0.01, max_amount: float = 100000) -> bool:
        """
        Validate transaction amount
        
        Args:
            amount: Amount to validate
            min_amount: Minimum amount
            max_amount: Maximum amount
            
        Returns:
            True if valid
        """
        return min_amount <= amount <= max_amount
    
    @staticmethod
    def validate_tx_hash(tx_hash: str) -> bool:
        """
        Validate transaction hash
        
        Args:
            tx_hash: Transaction hash to validate
            
        Returns:
            True if valid
        """
        # Ethereum transaction hash is 66 characters (0x + 64 hex chars)
        return len(tx_hash) == 66 and tx_hash.startswith("0x") and all(c in "0123456789abcdef" for c in tx_hash[2:])
    
    @staticmethod
    def sanitize_string(value: str, max_length: int = 1000) -> str:
        """
        Sanitize string input
        
        Args:
            value: String to sanitize
            max_length: Maximum length
            
        Returns:
            Sanitized string
        """
        # Remove null bytes and trim
        sanitized = value.replace("\x00", "").strip()
        
        # Truncate if too long
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized

