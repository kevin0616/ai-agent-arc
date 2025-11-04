"""
Contract Caller - Calls smart contract functions
"""
from typing import Dict, Any, List, Optional
from src.blockchain.arc_client import ArcClient


class ContractCaller:
    """Calls smart contract functions"""
    
    def __init__(self, arc_client: ArcClient, contracts_config: Dict[str, Any]):
        """
        Initialize contract caller
        
        Args:
            arc_client: Arc blockchain client
            contracts_config: Contract configuration with addresses and ABIs
        """
        self.arc = arc_client
        self.contracts = contracts_config
    
    async def send_payment(
        self,
        recipient: str,
        amount: float,
        memo: str = "",
        from_address: Optional[str] = None
    ) -> str:
        """
        Call PaymentRouter.sendPayment()
        
        Args:
            recipient: Recipient address
            amount: Amount in USD
            memo: Payment memo/description
            from_address: Sender address
            
        Returns:
            Transaction hash
        """
        if "PaymentRouter" not in self.contracts:
            raise ValueError("PaymentRouter not configured")
        
        contract_config = self.contracts["PaymentRouter"]
        contract_address = contract_config["address"]
        abi = contract_config["abi"]
        
        # Convert amount to USDC (6 decimals)
        from src.blockchain.usdc_handler import USDCHandler
        usdc_handler = USDCHandler(self.arc, self.contracts.get("USDC", {}).get("address", ""))
        amount_usdc = usdc_handler.to_usdc_amount(amount)
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='sendPayment',
            function_args=[recipient, amount_usdc, memo],
            abi=abi,
            from_address=from_address
        )
        
        return tx_hash
    
    async def split_payment(
        self,
        recipients: List[str],
        amounts: List[float],
        memo: str = "",
        from_address: Optional[str] = None
    ) -> str:
        """
        Call PaymentRouter.splitPayment()
        
        Args:
            recipients: List of recipient addresses
            amounts: List of amounts in USD
            memo: Payment memo/description
            from_address: Sender address
            
        Returns:
            Transaction hash
        """
        if "PaymentRouter" not in self.contracts:
            raise ValueError("PaymentRouter not configured")
        
        contract_config = self.contracts["PaymentRouter"]
        contract_address = contract_config["address"]
        abi = contract_config["abi"]
        
        # Convert amounts to USDC (6 decimals)
        from src.blockchain.usdc_handler import USDCHandler
        usdc_handler = USDCHandler(self.arc, self.contracts.get("USDC", {}).get("address", ""))
        amounts_usdc = [usdc_handler.to_usdc_amount(amt) for amt in amounts]
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='splitPayment',
            function_args=[recipients, amounts_usdc, memo],
            abi=abi,
            from_address=from_address
        )
        
        return tx_hash
    
    async def create_escrow(
        self,
        recipient: str,
        amount: float,
        days_until_deadline: int,
        description: str,
        requires_milestone: bool = True,
        from_address: Optional[str] = None
    ) -> str:
        """
        Call EscrowContract.createEscrow()
        
        Args:
            recipient: Recipient address
            amount: Amount in USD
            days_until_deadline: Days until escrow deadline
            description: Escrow description
            requires_milestone: Whether milestone is required
            from_address: Sender address
            
        Returns:
            Transaction hash
        """
        if "EscrowContract" not in self.contracts:
            raise ValueError("EscrowContract not configured")
        
        contract_config = self.contracts["EscrowContract"]
        contract_address = contract_config["address"]
        abi = contract_config["abi"]
        
        # Convert amount to USDC (6 decimals)
        from src.blockchain.usdc_handler import USDCHandler
        usdc_handler = USDCHandler(self.arc, self.contracts.get("USDC", {}).get("address", ""))
        amount_usdc = usdc_handler.to_usdc_amount(amount)
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='createEscrow',
            function_args=[
                recipient,
                amount_usdc,
                days_until_deadline,
                description,
                requires_milestone,
                ""  # milestone description
            ],
            abi=abi,
            from_address=from_address
        )
        
        return tx_hash

