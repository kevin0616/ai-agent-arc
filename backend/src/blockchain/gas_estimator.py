"""
Gas Estimator - Estimates gas costs for transactions
"""
from typing import Dict, Any
from src.blockchain.arc_client import ArcClient


class GasEstimator:
    """Estimates gas costs for transactions"""
    
    def __init__(self, arc_client: ArcClient):
        """
        Initialize gas estimator
        
        Args:
            arc_client: Arc blockchain client
        """
        self.arc = arc_client
    
    def estimate_gas(
        self,
        contract_address: str,
        function_name: str,
        function_args: list,
        abi: list,
        from_address: str
    ) -> int:
        """
        Estimate gas for a transaction
        
        Args:
            contract_address: Contract address
            function_name: Function name
            function_args: Function arguments
            abi: Contract ABI
            from_address: From address
            
        Returns:
            Estimated gas
        """
        try:
            contract = self.arc.w3.eth.contract(address=contract_address, abi=abi)
            function = getattr(contract.functions, function_name)
            
            gas_estimate = function(*function_args).estimate_gas({
                'from': from_address
            })
            
            # Add 20% buffer
            return int(gas_estimate * 1.2)
            
        except Exception as e:
            print(f"Error estimating gas: {e}")
            # Return default gas
            return 200000
    
    def get_gas_price(self) -> int:
        """
        Get current gas price
        
        Returns:
            Gas price in wei
        """
        try:
            return self.arc.w3.eth.gas_price
        except Exception as e:
            print(f"Error getting gas price: {e}")
            return 1000000000  # Default 1 gwei

