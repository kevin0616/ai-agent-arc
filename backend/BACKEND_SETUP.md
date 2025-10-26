# 🔌 Backend Setup - PayFlow AI

## For Person 3: AI & Backend Engineer

---

## 🚀 **Quick Start**

### **1. Install Dependencies:**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### **2. Setup Environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

### **3. Run Server:**
```bash
python main.py
# API runs on http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 📦 **Required Packages**

### **File: `requirements.txt`**
```txt
# Web Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-multipart==0.0.6

# AI & NLP
openai==1.12.0
anthropic==0.18.1
langchain==0.1.0
tiktoken==0.5.2

# Blockchain
web3==6.15.1
eth-account==0.11.0
eth-utils==4.0.0

# Database
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1

# Cache
redis==5.0.1

# WebSocket
python-socketio==5.11.0
websockets==12.0

# HTTP Client
httpx==0.26.0
aiohttp==3.9.3

# Utilities
python-dotenv==1.0.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3

# Logging
loguru==0.7.2
```

---

## 🏗️ **Project Structure**

```
backend/
├── src/
│   ├── ai/
│   │   ├── __init__.py
│   │   ├── agent.py              # Main AI agent
│   │   ├── intent_classifier.py  # Classify user intent
│   │   ├── entity_extractor.py   # Extract amounts, addresses
│   │   ├── prompts.py            # GPT prompts
│   │   ├── safety.py             # Transaction limits & checks
│   │   └── response_formatter.py # Format AI responses
│   │
│   ├── blockchain/
│   │   ├── __init__.py
│   │   ├── arc_client.py         # Arc RPC connection
│   │   ├── usdc_handler.py       # USDC transfers
│   │   ├── contract_caller.py    # Call smart contracts
│   │   ├── wallet_manager.py     # Wallet operations
│   │   └── gas_estimator.py      # Estimate gas costs
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py             # FastAPI routes
│   │   ├── websocket.py          # Real-time chat
│   │   ├── middleware.py         # Auth, CORS, logging
│   │   └── dependencies.py       # Dependency injection
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── transaction.py        # Transaction model
│   │   ├── user.py               # User model
│   │   └── message.py            # Chat message model
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── transaction_service.py
│   │   ├── user_service.py
│   │   └── cache_service.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── address_resolver.py   # ENS/email → address
│       ├── formatter.py          # Format numbers, dates
│       └── validator.py          # Input validation
│
├── tests/
│   ├── test_ai_agent.py
│   ├── test_intent_classifier.py
│   └── test_contract_caller.py
│
├── main.py                       # Entry point
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🤖 **AI Agent Architecture**

### **Intent Classification**

User commands → Intent types:

| User Command | Intent | Action |
|--------------|--------|--------|
| "Send $50 to Alice" | `simple_payment` | Call PaymentRouter.sendPayment() |
| "Split $300 4 ways" | `split_payment` | Call PaymentRouter.splitPayment() |
| "Escrow $2000" | `create_escrow` | Call EscrowContract.createEscrow() |
| "Pay $15/month" | `subscription` | Call PaymentRouter.createSubscription() |
| "Check my balance" | `balance_query` | Read USDC balance |

### **File: `ai/intent_classifier.py`**
```python
from enum import Enum
from openai import OpenAI

class Intent(Enum):
    SIMPLE_PAYMENT = "simple_payment"
    SPLIT_PAYMENT = "split_payment"
    CREATE_ESCROW = "create_escrow"
    RELEASE_ESCROW = "release_escrow"
    CREATE_SUBSCRIPTION = "subscription"
    CANCEL_SUBSCRIPTION = "cancel_subscription"
    BALANCE_QUERY = "balance_query"
    TRANSACTION_HISTORY = "history"
    DEFI_INVEST = "defi_invest"
    HELP = "help"
    UNKNOWN = "unknown"

class IntentClassifier:
    def __init__(self, openai_api_key: str):
        self.client = OpenAI(api_key=openai_api_key)
    
    async def classify(self, user_message: str) -> Intent:
        """Classify user intent using GPT-4"""
        
        system_prompt = """You are an intent classifier for a payment AI agent.
        Classify the user's message into one of these intents:
        - simple_payment: Send money to one person
        - split_payment: Split bill between multiple people
        - create_escrow: Lock money with conditions
        - release_escrow: Release locked money
        - subscription: Set up recurring payment
        - cancel_subscription: Cancel recurring payment
        - balance_query: Check USDC balance
        - history: View transaction history
        - defi_invest: Invest in DeFi protocols
        - help: Ask for help
        - unknown: Cannot determine intent
        
        Respond with ONLY the intent name."""
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
        )
        
        intent_str = response.choices[0].message.content.strip().lower()
        
        try:
            return Intent(intent_str)
        except ValueError:
            return Intent.UNKNOWN
```

### **File: `ai/entity_extractor.py`**
```python
import re
from typing import Dict, Any, Optional
from openai import OpenAI

class EntityExtractor:
    def __init__(self, openai_api_key: str):
        self.client = OpenAI(api_key=openai_api_key)
    
    async def extract(self, user_message: str, intent: str) -> Dict[str, Any]:
        """Extract entities from user message"""
        
        system_prompt = f"""Extract entities from the user's payment command.
        Intent: {intent}
        
        Return a JSON object with these fields (if applicable):
        - amount: dollar amount (number)
        - recipient: recipient name/address/email (string)
        - recipients: list of recipients for split payments (array)
        - num_people: number of people to split between (number)
        - frequency: for subscriptions (daily/weekly/monthly)
        - duration: escrow duration in days (number)
        - description: payment description (string)
        
        Example:
        Input: "Send $50 to alice@email.com"
        Output: {{"amount": 50, "recipient": "alice@email.com"}}
        
        Input: "Split $300 between 4 people"
        Output: {{"amount": 300, "num_people": 4}}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        import json
        entities = json.loads(response.choices[0].message.content)
        
        return entities
```

---

## ⛓️ **Blockchain Integration**

### **File: `blockchain/arc_client.py`**
```python
from web3 import Web3
from typing import Dict, Any

class ArcClient:
    def __init__(self, rpc_url: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.account = self.w3.eth.account.from_key(private_key)
        
    def get_balance(self, address: str, token_address: str) -> float:
        """Get USDC balance"""
        # ERC20 ABI (balanceOf function)
        abi = [{"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}]
        
        contract = self.w3.eth.contract(address=token_address, abi=abi)
        balance_wei = contract.functions.balanceOf(address).call()
        
        # USDC has 6 decimals
        balance = balance_wei / 10**6
        return balance
    
    async def send_transaction(
        self,
        contract_address: str,
        function_name: str,
        function_args: list,
        abi: list
    ) -> str:
        """Send transaction to smart contract"""
        
        contract = self.w3.eth.contract(address=contract_address, abi=abi)
        function = getattr(contract.functions, function_name)
        
        # Build transaction
        transaction = function(*function_args).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price,
        })
        
        # Sign transaction
        signed = self.w3.eth.account.sign_transaction(transaction, self.account.key)
        
        # Send transaction
        tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
        
        return tx_hash.hex()
```

### **File: `blockchain/contract_caller.py`**
```python
from typing import Dict, Any
from .arc_client import ArcClient

class ContractCaller:
    def __init__(self, arc_client: ArcClient, contracts_config: Dict[str, Any]):
        self.arc = arc_client
        self.contracts = contracts_config
    
    async def send_payment(
        self,
        recipient: str,
        amount: float,
        memo: str = ""
    ) -> str:
        """Call PaymentRouter.sendPayment()"""
        
        contract_address = self.contracts['PaymentRouter']['address']
        abi = self.contracts['PaymentRouter']['abi']
        
        # Convert amount to USDC (6 decimals)
        amount_usdc = int(amount * 10**6)
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='sendPayment',
            function_args=[recipient, amount_usdc, memo],
            abi=abi
        )
        
        return tx_hash
    
    async def split_payment(
        self,
        recipients: list[str],
        amounts: list[float],
        memo: str = ""
    ) -> str:
        """Call PaymentRouter.splitPayment()"""
        
        contract_address = self.contracts['PaymentRouter']['address']
        abi = self.contracts['PaymentRouter']['abi']
        
        # Convert amounts to USDC
        amounts_usdc = [int(amt * 10**6) for amt in amounts]
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='splitPayment',
            function_args=[recipients, amounts_usdc, memo],
            abi=abi
        )
        
        return tx_hash
    
    async def create_escrow(
        self,
        recipient: str,
        amount: float,
        days_until_deadline: int,
        description: str,
        requires_milestone: bool = True
    ) -> str:
        """Call EscrowContract.createEscrow()"""
        
        contract_address = self.contracts['EscrowContract']['address']
        abi = self.contracts['EscrowContract']['abi']
        
        amount_usdc = int(amount * 10**6)
        
        tx_hash = await self.arc.send_transaction(
            contract_address=contract_address,
            function_name='createEscrow',
            function_args=[
                recipient,
                amount_usdc,
                days_until_deadline,
                description,
                requires_milestone,
                "" # milestone description
            ],
            abi=abi
        )
        
        return tx_hash
```

---

## 🌐 **API Routes**

### **File: `api/routes.py`**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="PayFlow AI API")

class ChatMessage(BaseModel):
    message: str
    user_address: Optional[str] = None

class ChatResponse(BaseModel):
    intent: str
    response: str
    transaction_hash: Optional[str] = None
    status: str

@app.post("/api/chat", response_model=ChatResponse)
async def process_message(msg: ChatMessage):
    """Process user message with AI agent"""
    
    # 1. Classify intent
    intent = await intent_classifier.classify(msg.message)
    
    # 2. Extract entities
    entities = await entity_extractor.extract(msg.message, intent.value)
    
    # 3. Execute action based on intent
    if intent == Intent.SIMPLE_PAYMENT:
        recipient = entities.get('recipient')
        amount = entities.get('amount')
        
        # Call smart contract
        tx_hash = await contract_caller.send_payment(
            recipient=recipient,
            amount=amount,
            memo="Payment via PayFlow AI"
        )
        
        return ChatResponse(
            intent=intent.value,
            response=f"✅ Sent ${amount} USDC to {recipient}",
            transaction_hash=tx_hash,
            status="success"
        )
    
    elif intent == Intent.BALANCE_QUERY:
        balance = await arc_client.get_balance(
            msg.user_address,
            usdc_contract_address
        )
        
        return ChatResponse(
            intent=intent.value,
            response=f"Your balance: ${balance:.2f} USDC",
            status="success"
        )
    
    # ... handle other intents
    
    return ChatResponse(
        intent=intent.value,
        response="I can help you with payments! Try: 'Send $50 to Alice'",
        status="success"
    )

@app.get("/api/balance/{address}")
async def get_balance(address: str):
    """Get USDC balance for address"""
    balance = await arc_client.get_balance(address, usdc_contract_address)
    return {"balance": balance, "symbol": "USDC"}

@app.get("/api/transactions/{address}")
async def get_transactions(address: str):
    """Get transaction history"""
    # Query from database
    transactions = await transaction_service.get_by_address(address)
    return {"transactions": transactions}
```

---

## 🔐 **Safety & Validation**

### **File: `ai/safety.py`**
```python
class SafetyChecker:
    MAX_SINGLE_TRANSACTION = 10000  # $10,000
    MAX_DAILY_AMOUNT = 50000        # $50,000
    
    def check_transaction_limits(
        self,
        amount: float,
        user_address: str
    ) -> tuple[bool, str]:
        """Check if transaction is within limits"""
        
        # Check single transaction limit
        if amount > self.MAX_SINGLE_TRANSACTION:
            return False, f"Amount exceeds single transaction limit (${self.MAX_SINGLE_TRANSACTION})"
        
        # Check daily limit
        daily_total = self.get_daily_total(user_address)
        if daily_total + amount > self.MAX_DAILY_AMOUNT:
            return False, f"Amount would exceed daily limit (${self.MAX_DAILY_AMOUNT})"
        
        return True, "OK"
    
    def validate_address(self, address: str) -> bool:
        """Validate Ethereum address"""
        from web3 import Web3
        return Web3.is_address(address)
    
    def require_confirmation(self, amount: float) -> bool:
        """Check if amount requires confirmation"""
        return amount > 1000  # Require confirmation for >$1000
```

---

## 📊 **Database Models**

### **File: `models/transaction.py`**
```python
from sqlalchemy import Column, String, Float, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True)
    tx_hash = Column(String, unique=True, index=True)
    from_address = Column(String, index=True)
    to_address = Column(String, index=True)
    amount = Column(Float)
    intent = Column(String)
    status = Column(String)  # pending, success, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## ⚙️ **Configuration**

### **File: `.env.example`**
```bash
# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Arc Blockchain
ARC_RPC_URL=https://rpc.arc-testnet.example.com
ARC_CHAIN_ID=123456
PRIVATE_KEY=0x...  # For backend transactions

# Smart Contracts (Get from Person 1)
PAYMENT_ROUTER_ADDRESS=0x...
ESCROW_CONTRACT_ADDRESS=0x...
USDC_CONTRACT_ADDRESS=0x...

# Database
DATABASE_URL=postgresql://user:pass@localhost/payflow

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=8000
ENV=development
```

---

## 🧪 **Testing**

### **Test AI Agent:**
```bash
pytest tests/test_ai_agent.py -v
```

### **Test Intent Classifier:**
```python
# tests/test_intent_classifier.py
import pytest
from src.ai.intent_classifier import IntentClassifier, Intent

@pytest.mark.asyncio
async def test_simple_payment_intent():
    classifier = IntentClassifier(api_key="test")
    intent = await classifier.classify("Send $50 to Alice")
    assert intent == Intent.SIMPLE_PAYMENT

@pytest.mark.asyncio
async def test_split_payment_intent():
    classifier = IntentClassifier(api_key="test")
    intent = await classifier.classify("Split $300 between 4 people")
    assert intent == Intent.SPLIT_PAYMENT
```

---

## 📞 **Coordination**

### **With Person 1 (Contracts):**
- Get deployed contract addresses
- Import contract ABIs
- Test contract calls
- Report any issues

### **With Person 2 (Frontend):**
- Document API endpoints
- Test WebSocket connection
- Handle CORS properly
- Provide error messages

### **With Person 4 (Demo):**
- Ensure AI responses are impressive
- Fast response times (<2s)
- Clear error messages
- Logging for debugging

---

## 🏆 **Success Criteria**

### **Week 1:**
- [ ] AI classifies 5 intent types correctly
- [ ] Can call smart contracts
- [ ] API endpoints working
- [ ] WebSocket connection stable

### **Week 2:**
- [ ] All intents handled
- [ ] Safety checks implemented
- [ ] Fast response times (<2s)
- [ ] Production-ready

---

**You got this, Person 3! Build the brain of PayFlow AI! 🤖🔥**
