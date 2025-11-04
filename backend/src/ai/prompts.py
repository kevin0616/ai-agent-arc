"""
AI Prompts for different intents and responses
"""

SYSTEM_PROMPT = """You are PayFlow AI, a helpful payment assistant that processes cryptocurrency transactions.
You understand natural language commands for sending payments, splitting bills, creating escrows, and more.
Always be clear, concise, and confirm actions before executing transactions."""

INTENT_PROMPTS = {
    "simple_payment": """Help the user send a payment to a recipient.
Extract the amount and recipient address/email/name.""",
    
    "split_payment": """Help the user split a payment between multiple people.
Extract the total amount and number of people or list of recipients.""",
    
    "create_escrow": """Help the user create an escrow payment.
Extract the amount, recipient, duration, and description.""",
    
    "balance_query": """Check the user's USDC balance.
You don't need to extract entities, just respond with the balance.""",
    
    "transaction_history": """Get the user's transaction history.
You don't need to extract entities, just fetch and display the history.""",
}

RESPONSE_TEMPLATES = {
    "simple_payment": "✅ Sent ${amount} USDC to {recipient}. Transaction: {tx_hash}",
    "split_payment": "✅ Split ${amount} between {num_people} people. Transaction: {tx_hash}",
    "create_escrow": "✅ Created escrow for ${amount} USDC. Transaction: {tx_hash}",
    "balance_query": "Your balance: ${balance:.2f} USDC",
    "transaction_history": "Here are your recent transactions:",
    "error": "❌ Error: {error_message}",
    "help": """I can help you with:
- Send payments: "Send $50 to Alice"
- Split payments: "Split $300 between 4 people"
- Create escrow: "Escrow $2000 for project"
- Check balance: "What's my balance?"
- View history: "Show my transactions"
""",
}

