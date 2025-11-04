"""
Arc Blockchain Client - Connects to Arc testnet RPC
"""
from typing import Dict, Any, Optional
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount


class ArcClient:
    """Client for interacting with Arc blockchain"""
    
    def __init__(self, rpc_url: str, private_key: Optional[str] = None):
        """
        Initialize Arc client
        
        Args:
            rpc_url: Arc RPC URL
            private_key: Private key for signing transactions (optional)
        """
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.rpc_url = rpc_url
        
        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to Arc RPC: {rpc_url}")
        
        if private_key:
            self.account: LocalAccount = Account.from_key(private_key)
        else:
            self.account = None
    
    def is_connected(self) -> bool:
        """Check if connected to blockchain"""
        return self.w3.is_connected()
    
    def get_balance(self, address: str, token_address: Optional[str] = None) -> float:
        """
        Get balance for an address
        
        Args:
            address: Address to check
            token_address: Token contract address (None for native token)
            
        Returns:
            Balance as float
        """
        if token_address:
            # ERC20 balance (USDC)
            abi = [{
                "inputs": [{"name": "account", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            }]
            
            try:
                contract = self.w3.eth.contract(address=token_address, abi=abi)
                balance_wei = contract.functions.balanceOf(address).call()
                
                # USDC has 6 decimals
                balance = balance_wei / 10**6
                return balance
            except Exception as e:
                print(f"Error getting token balance: {e}")
                return 0.0
        else:
            # Native token balance
            try:
                balance_wei = self.w3.eth.get_balance(address)
                balance = self.w3.from_wei(balance_wei, "ether")
                return float(balance)
            except Exception as e:
                print(f"Error getting native balance: {e}")
                return 0.0
    
    async def send_transaction(
        self,
        contract_address: str,
        function_name: str,
        function_args: list,
        abi: list,
        from_address: Optional[str] = None
    ) -> str:
        """
        Send transaction to smart contract
        
        Args:
            contract_address: Contract address
            function_name: Function name to call
            function_args: Function arguments
            abi: Contract ABI
            from_address: Address to send from (uses account if not provided)
            
        Returns:
            Transaction hash
        """
        if not self.account:
            raise ValueError("Private key required for sending transactions")
        
        from_addr = from_address or self.account.address
        
        try:
            contract = self.w3.eth.contract(address=contract_address, abi=abi)
            function = getattr(contract.functions, function_name)
            
            # Build transaction
            transaction = function(*function_args).build_transaction({
                'from': from_addr,
                'nonce': self.w3.eth.get_transaction_count(from_addr),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
            })
            
            # Sign transaction
            signed = self.account.sign_transaction(transaction)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
            
            return tx_hash.hex()
            
        except Exception as e:
            print(f"Error sending transaction: {e}")
            raise
    
    def get_transaction_receipt(self, tx_hash: str) -> Dict[str, Any]:
        """
        Get transaction receipt
        
        Args:
            tx_hash: Transaction hash
            
        Returns:
            Transaction receipt
        """
        try:
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            return dict(receipt)
        except Exception as e:
            print(f"Error getting transaction receipt: {e}")
            return {}

