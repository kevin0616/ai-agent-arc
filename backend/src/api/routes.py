"""
API Routes - FastAPI routes for chat, balance, transactions, etc.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from src.api.dependencies import get_ai_agent, get_arc_client, get_contract_caller
from src.ai.agent import AIAgent
from src.ai.intent_classifier import Intent
from src.blockchain.arc_client import ArcClient
from src.blockchain.contract_caller import ContractCaller
from src.blockchain.usdc_handler import USDCHandler
import os

router = APIRouter()


# Request/Response Models
class ChatMessage(BaseModel):
    """Chat message request model"""
    message: str
    user_address: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response model"""
    intent: str
    response: str
    transaction_hash: Optional[str] = None
    status: str
    entities: Optional[dict] = None


class BalanceResponse(BaseModel):
    """Balance response model"""
    balance: float
    symbol: str
    address: str


class TransactionRequest(BaseModel):
    """Transaction request model"""
    recipient: str
    amount: float
    memo: Optional[str] = ""


class TransactionResponse(BaseModel):
    """Transaction response model"""
    transaction_hash: str
    status: str
    message: str


# Routes
@router.post("/chat", response_model=ChatResponse)
async def process_message(
    msg: ChatMessage,
    ai_agent: AIAgent = Depends(get_ai_agent),
    contract_caller: ContractCaller = Depends(get_contract_caller)
):
    """
    Process user message with AI agent and execute transactions
    
    Args:
        msg: Chat message request
        ai_agent: AI agent instance
        contract_caller: Contract caller instance
        
    Returns:
        Chat response with intent and result
    """
    try:
        # Process message with AI agent
        result = await ai_agent.process_message(
            user_message=msg.message,
            user_address=msg.user_address
        )
        
        # If intent is simple_payment and we have entities, execute transaction
        if result["intent"] == "simple_payment" and result["status"] == "success":
            entities = result.get("entities", {})
            amount = entities.get("amount")
            recipient = entities.get("recipient")
            
            # Try to resolve recipient address if it's not already an address
            if recipient and not recipient.startswith("0x"):
                # In production, resolve email/name to address
                # For now, assume it's an address or placeholder
                pass
            
            # Execute transaction if we have all required info
            if amount and recipient and msg.user_address:
                try:
                    tx_hash = await contract_caller.send_payment(
                        recipient=recipient,
                        amount=amount,
                        memo=entities.get("description", ""),
                        from_address=msg.user_address
                    )
                    result["transaction_hash"] = tx_hash
                    result["response"] = f"✅ Sent ${amount:.2f} USDC to {recipient[:10]}...{recipient[-8:]}. Transaction: {tx_hash[:10]}...{tx_hash[-8:]}"
                except Exception as e:
                    result["status"] = "error"
                    result["response"] = f"❌ Transaction failed: {str(e)}"
        
        return ChatResponse(
            intent=result["intent"],
            response=result["response"],
            transaction_hash=result.get("transaction_hash"),
            status=result["status"],
            entities=result.get("entities")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/balance/{address}", response_model=BalanceResponse)
async def get_balance(
    address: str,
    arc_client: ArcClient = Depends(get_arc_client)
):
    """
    Get USDC balance for an address
    
    Args:
        address: Wallet address
        arc_client: Arc blockchain client
        
    Returns:
        Balance response
    """
    try:
        usdc_address = os.getenv("USDC_CONTRACT_ADDRESS", "")
        if not usdc_address:
            raise HTTPException(status_code=500, detail="USDC contract address not configured")
        
        usdc_handler = USDCHandler(arc_client, usdc_address)
        balance = usdc_handler.get_balance(address)
        
        return BalanceResponse(
            balance=balance,
            symbol="USDC",
            address=address
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transaction/send", response_model=TransactionResponse)
async def send_transaction(
    tx_request: TransactionRequest,
    contract_caller: ContractCaller = Depends(get_contract_caller),
    user_address: Optional[str] = None
):
    """
    Send a payment transaction
    
    Args:
        tx_request: Transaction request
        contract_caller: Contract caller instance
        user_address: User's wallet address (from auth)
        
    Returns:
        Transaction response
    """
    try:
        if not user_address:
            raise HTTPException(status_code=400, detail="User address required")
        
        tx_hash = await contract_caller.send_payment(
            recipient=tx_request.recipient,
            amount=tx_request.amount,
            memo=tx_request.memo or "",
            from_address=user_address
        )
        
        return TransactionResponse(
            transaction_hash=tx_hash,
            status="pending",
            message=f"Transaction submitted: {tx_hash}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/transactions/{address}")
async def get_transactions(
    address: str,
    limit: int = 10
):
    """
    Get transaction history for an address
    
    Args:
        address: Wallet address
        limit: Maximum number of transactions
        
    Returns:
        List of transactions
    """
    try:
        # In production, query from database
        # For now, return empty list
        return {
            "transactions": [],
            "address": address,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/transaction/{tx_hash}")
async def get_transaction(
    tx_hash: str,
    arc_client: ArcClient = Depends(get_arc_client)
):
    """
    Get transaction details by hash
    
    Args:
        tx_hash: Transaction hash
        arc_client: Arc blockchain client
        
    Returns:
        Transaction details
    """
    try:
        receipt = arc_client.get_transaction_receipt(tx_hash)
        return {
            "transaction_hash": tx_hash,
            "receipt": receipt,
            "status": "success" if receipt.get("status") == 1 else "failed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

