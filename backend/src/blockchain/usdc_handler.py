"""
USDC Handler - Handles USDC token operations
"""
from typing import Optional
from src.blockchain.arc_client import ArcClient


class USDCHandler:
    """Handler for USDC token operations"""
    
    USDC_DECIMALS = 6
    
    def __init__(self, arc_client: ArcClient, usdc_address: str):
        """
        Initialize USDC handler
        
        Args:
            arc_client: Arc blockchain client
            usdc_address: USDC contract address
        """
        self.arc = arc_client
        self.usdc_address = usdc_address
    
    def get_balance(self, address: str) -> float:
        """
        Get USDC balance for an address
        
        Args:
            address: Address to check
            
        Returns:
            USDC balance
        """
        return self.arc.get_balance(address, self.usdc_address)
    
    def to_usdc_amount(self, amount_usd: float) -> int:
        """
        Convert USD amount to USDC (6 decimals)
        
        Args:
            amount_usd: Amount in USD
            
        Returns:
            Amount in USDC (smallest unit)
        """
        return int(amount_usd * 10**self.USDC_DECIMALS)
    
    def from_usdc_amount(self, amount_usdc: int) -> float:
        """
        Convert USDC (smallest unit) to USD amount
        
        Args:
            amount_usdc: Amount in USDC (smallest unit)
            
        Returns:
            Amount in USD
        """
        return amount_usdc / 10**self.USDC_DECIMALS

