"""
API Dependencies - Dependency injection for routes
"""
import os
from typing import Optional
from src.ai.agent import AIAgent
from src.ai.intent_classifier import IntentClassifier
from src.ai.entity_extractor import EntityExtractor
from src.ai.safety import SafetyChecker
from src.blockchain.arc_client import ArcClient
from src.blockchain.contract_caller import ContractCaller


# Global instances (would be better with proper DI container)
_ai_agent: Optional[AIAgent] = None
_contract_caller: Optional[ContractCaller] = None
_arc_client: Optional[ArcClient] = None


def get_ai_agent() -> AIAgent:
    """Get AI agent instance"""
    global _ai_agent
    if _ai_agent is None:
        intent_classifier = IntentClassifier()
        entity_extractor = EntityExtractor()
        safety_checker = SafetyChecker()
        _ai_agent = AIAgent(
            intent_classifier=intent_classifier,
            entity_extractor=entity_extractor,
            safety_checker=safety_checker
        )
    return _ai_agent


def get_arc_client() -> ArcClient:
    """Get Arc blockchain client"""
    global _arc_client
    if _arc_client is None:
        rpc_url = os.getenv("ARC_RPC_URL", "https://rpc-test-1.archiechain.io")
        private_key = os.getenv("PRIVATE_KEY")
        _arc_client = ArcClient(rpc_url=rpc_url, private_key=private_key)
    return _arc_client


def get_contract_caller() -> ContractCaller:
    """Get contract caller instance"""
    global _contract_caller
    if _contract_caller is None:
        arc_client = get_arc_client()
        contracts_config = {
            "PaymentRouter": {
                "address": os.getenv("PAYMENT_ROUTER_ADDRESS", ""),
                "abi": []  # Load from ABI file in production
            },
            "EscrowContract": {
                "address": os.getenv("ESCROW_CONTRACT_ADDRESS", ""),
                "abi": []  # Load from ABI file in production
            },
            "USDC": {
                "address": os.getenv("USDC_CONTRACT_ADDRESS", ""),
                "abi": []
            }
        }
        _contract_caller = ContractCaller(arc_client=arc_client, contracts_config=contracts_config)
    return _contract_caller

