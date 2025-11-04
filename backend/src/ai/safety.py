"""
Safety Checker - Validates transactions and enforces limits
"""
from typing import Tuple


class SafetyChecker:
    """Validates transactions and enforces safety limits"""
    
    MAX_SINGLE_TRANSACTION = 10000  # $10,000
    MAX_DAILY_AMOUNT = 50000        # $50,000
    
    def __init__(self):
        """Initialize safety checker"""
        # In production, this would connect to a database or cache
        # to track daily transaction totals per user
        self.daily_totals = {}  # address -> total amount
    
    def check_transaction_limits(
        self,
        amount: float,
        user_address: str
    ) -> Tuple[bool, str]:
        """
        Check if transaction is within limits
        
        Args:
            amount: Transaction amount in USD
            user_address: User's wallet address
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check single transaction limit
        if amount > self.MAX_SINGLE_TRANSACTION:
            return False, f"Amount exceeds single transaction limit (${self.MAX_SINGLE_TRANSACTION})"
        
        # Check daily limit
        daily_total = self.get_daily_total(user_address)
        if daily_total + amount > self.MAX_DAILY_AMOUNT:
            return False, f"Amount would exceed daily limit (${self.MAX_DAILY_AMOUNT})"
        
        return True, "OK"
    
    def validate_address(self, address: str) -> bool:
        """
        Validate Ethereum address format
        
        Args:
            address: Address string to validate
            
        Returns:
            True if valid, False otherwise
        """
        from web3 import Web3
        try:
            return Web3.is_address(address) and Web3.is_checksum_address(address)
        except:
            # Try to convert to checksum
            try:
                checksum_address = Web3.to_checksum_address(address)
                return Web3.is_address(checksum_address)
            except:
                return False
    
    def require_confirmation(self, amount: float) -> bool:
        """
        Check if amount requires additional confirmation
        
        Args:
            amount: Transaction amount
            
        Returns:
            True if confirmation required
        """
        return amount > 1000  # Require confirmation for >$1000
    
    def get_daily_total(self, user_address: str) -> float:
        """
        Get total transaction amount for user today
        
        Args:
            user_address: User's wallet address
            
        Returns:
            Total amount transacted today
        """
        # In production, this would query a database
        # For now, return from in-memory cache
        return self.daily_totals.get(user_address, 0.0)
    
    def record_transaction(self, user_address: str, amount: float):
        """
        Record a transaction for daily limit tracking
        
        Args:
            user_address: User's wallet address
            amount: Transaction amount
        """
        if user_address not in self.daily_totals:
            self.daily_totals[user_address] = 0.0
        self.daily_totals[user_address] += amount

