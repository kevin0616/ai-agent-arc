"""
Address Resolver - Resolves email/name to wallet address
"""
from typing import Optional
from web3 import Web3


class AddressResolver:
    """Resolves email/name to wallet address"""
    
    def __init__(self):
        """Initialize address resolver"""
        # In production, this would query a database or ENS
        self.address_book: dict = {}
    
    def resolve(self, identifier: str) -> Optional[str]:
        """
        Resolve identifier to wallet address
        
        Args:
            identifier: Email, name, or address
            
        Returns:
            Wallet address or None
        """
        # If already an address, validate and return
        if Web3.is_address(identifier):
            try:
                return Web3.to_checksum_address(identifier)
            except:
                return None
        
        # Check address book
        if identifier.lower() in self.address_book:
            return self.address_book[identifier.lower()]
        
        # In production, query database or ENS
        return None
    
    def add_to_address_book(self, identifier: str, address: str):
        """
        Add identifier to address book
        
        Args:
            identifier: Email or name
            address: Wallet address
        """
        if not Web3.is_address(address):
            raise ValueError("Invalid wallet address")
        
        self.address_book[identifier.lower()] = Web3.to_checksum_address(address)

