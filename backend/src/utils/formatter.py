"""
Formatter - Formats numbers, dates, addresses, etc.
"""
from typing import Optional
from datetime import datetime


class Formatter:
    """Utility for formatting data"""
    
    @staticmethod
    def format_amount(amount: float, decimals: int = 2) -> str:
        """
        Format amount as currency
        
        Args:
            amount: Amount to format
            decimals: Number of decimal places
            
        Returns:
            Formatted amount string
        """
        return f"${amount:,.{decimals}f}"
    
    @staticmethod
    def format_address(address: str, start_chars: int = 6, end_chars: int = 4) -> str:
        """
        Format address for display (shorten)
        
        Args:
            address: Wallet address
            start_chars: Number of characters at start
            end_chars: Number of characters at end
            
        Returns:
            Formatted address
        """
        if len(address) <= start_chars + end_chars:
            return address
        return f"{address[:start_chars]}...{address[-end_chars:]}"
    
    @staticmethod
    def format_tx_hash(tx_hash: str, start_chars: int = 10, end_chars: int = 8) -> str:
        """
        Format transaction hash for display
        
        Args:
            tx_hash: Transaction hash
            start_chars: Number of characters at start
            end_chars: Number of characters at end
            
        Returns:
            Formatted transaction hash
        """
        if len(tx_hash) <= start_chars + end_chars:
            return tx_hash
        return f"{tx_hash[:start_chars]}...{tx_hash[-end_chars:]}"
    
    @staticmethod
    def format_date(date: datetime) -> str:
        """
        Format date for display
        
        Args:
            date: Date to format
            
        Returns:
            Formatted date string
        """
        return date.strftime("%Y-%m-%d %H:%M:%S")
    
    @staticmethod
    def format_relative_time(date: datetime) -> str:
        """
        Format relative time (e.g., "2 hours ago")
        
        Args:
            date: Date to format
            
        Returns:
            Relative time string
        """
        now = datetime.utcnow()
        diff = now - date
        
        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "just now"

