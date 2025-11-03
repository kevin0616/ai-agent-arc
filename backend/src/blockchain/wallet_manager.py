"""
Wallet Manager - Manages wallet operations
"""
from typing import Optional
from eth_account import Account
from src.blockchain.arc_client import ArcClient


class WalletManager:
    """Manages wallet operations"""
    
    def __init__(self, arc_client: ArcClient):
        """
        Initialize wallet manager
        
        Args:
            arc_client: Arc blockchain client
        """
        self.arc = arc_client
    
    def create_wallet(self) -> dict:
        """
        Create a new wallet
        
        Returns:
            Dictionary with address and private key
        """
        account = Account.create()
        return {
            "address": account.address,
            "private_key": account.key.hex()
        }
    
    def get_address_from_private_key(self, private_key: str) -> str:
        """
        Get address from private key
        
        Args:
            private_key: Private key (hex string)
            
        Returns:
            Address
        """
        account = Account.from_key(private_key)
        return account.address
    
    def validate_address(self, address: str) -> bool:
        """
        Validate Ethereum address
        
        Args:
            address: Address to validate
            
        Returns:
            True if valid
        """
        from web3 import Web3
        return Web3.is_address(address)

