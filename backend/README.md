# PayFlow AI Backend

Python backend for PayFlow AI - A voice-enabled payment assistant built on Arc blockchain.

## 🚀 Quick Start

### 1. Install Dependencies

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

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your API keys and contract addresses
```

Required environment variables:
- `OPENAI_API_KEY` - OpenAI API key for AI agent
- `ARC_RPC_URL` - Arc testnet RPC URL (default: https://rpc-test-1.archiechain.io)
- `PAYMENT_ROUTER_ADDRESS` - PaymentRouter contract address
- `USDC_CONTRACT_ADDRESS` - USDC contract address

### 3. Run Server

```bash
python main.py
# API runs on http://localhost:8000
# Docs: http://localhost:8000/docs
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── ai/                    # AI agent modules
│   │   ├── agent.py           # Main AI agent
│   │   ├── intent_classifier.py
│   │   ├── entity_extractor.py
│   │   ├── prompts.py
│   │   ├── safety.py
│   │   └── response_formatter.py
│   │
│   ├── blockchain/            # Blockchain integration
│   │   ├── arc_client.py      # Arc RPC client
│   │   ├── usdc_handler.py
│   │   ├── contract_caller.py
│   │   ├── wallet_manager.py
│   │   └── gas_estimator.py
│   │
│   ├── api/                   # API routes and middleware
│   │   ├── routes.py          # FastAPI routes
│   │   ├── websocket.py       # WebSocket handler
│   │   ├── middleware.py      # CORS, logging
│   │   └── dependencies.py   # Dependency injection
│   │
│   ├── models/                # Database models
│   │   ├── transaction.py
│   │   ├── user.py
│   │   └── message.py
│   │
│   ├── services/              # Business logic
│   │   ├── transaction_service.py
│   │   ├── user_service.py
│   │   └── cache_service.py
│   │
│   └── utils/                 # Utilities
│       ├── address_resolver.py
│       ├── formatter.py
│       └── validator.py
│
├── main.py                    # Entry point
├── requirements.txt
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Chat

- `POST /api/chat` - Process chat message with AI agent
  ```json
  {
    "message": "Send $50 to Alice",
    "user_address": "0x..."
  }
  ```

### Balance

- `GET /api/balance/{address}` - Get USDC balance for address

### Transactions

- `POST /api/transaction/send` - Send payment transaction
- `GET /api/transactions/{address}` - Get transaction history
- `GET /api/transaction/{tx_hash}` - Get transaction details

## 🤖 AI Agent

The AI agent processes natural language commands and executes blockchain transactions:

- **Intent Classification**: Classifies user messages into payment intents
- **Entity Extraction**: Extracts amounts, recipients, and other entities
- **Safety Checks**: Validates transactions and enforces limits
- **Response Formatting**: Formats responses for frontend display

### Supported Intents

- `simple_payment` - Send money to one person
- `split_payment` - Split bill between multiple people
- `create_escrow` - Lock money with conditions
- `balance_query` - Check USDC balance
- `transaction_history` - View transaction history
- `help` - Get help information

## ⛓️ Blockchain Integration

The backend integrates with Arc blockchain:

- **Arc Client**: Connects to Arc testnet RPC
- **Contract Caller**: Calls smart contract functions
- **USDC Handler**: Handles USDC token operations
- **Gas Estimator**: Estimates gas costs

## 🧪 Testing

```bash
pytest
```

## 📝 Notes

- Database models are defined but not connected (use SQLAlchemy in production)
- Cache service uses in-memory cache (use Redis in production)
- WebSocket support is included but not fully implemented
- Transaction execution requires user's private key or wallet signature

## 🔗 Coordination

- **With Person 1 (Contracts)**: Get deployed contract addresses and ABIs
- **With Person 2 (Frontend)**: Ensure API endpoints match frontend needs
- **With Person 4 (Demo)**: Test end-to-end flows

