# Connect Smart Contracts to Backend (Python FastAPI)

This guide shows how to call `PaymentRouter` and `EscrowContract` from a Python backend using `web3.py`.

## 1) Install dependencies
```bash
cd backend
pip install web3 python-dotenv
```

## 2) Configure environment
Create `backend/.env`:
```ini
RPC_URL=https://arc-testnet.example
PRIVATE_KEY=0xYOUR_PRIVATE_KEY   # for server wallet (optional)
ROUTER_ADDRESS=0xYourRouter
USDC_ADDRESS=0xUsdcOnArc
```

Load env in your app (e.g., `backend/src/blockchain/arc_client.py`):
```python
import os
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()

RPC_URL = os.getenv('RPC_URL')
web3 = Web3(Web3.HTTPProvider(RPC_URL))
assert web3.is_connected(), 'RPC not connected'
```

## 3) Load ABIs
Copy the `abi` arrays from Foundry build outputs and save as JSON in backend, e.g.:
- `backend/src/abi/PaymentRouter.json`
- `backend/src/abi/EscrowContract.json`

Example loader (`backend/src/blockchain/contract_caller.py`):
```python
import json
import os
from web3 import Web3
from .arc_client import web3

BASE = os.path.dirname(__file__)

def load_abi(name: str):
    with open(os.path.join(BASE, '..', 'abi', f'{name}.json'), 'r') as f:
        return json.load(f)

router_abi = load_abi('PaymentRouter')
escrow_abi = load_abi('EscrowContract')

ROUTER_ADDRESS = Web3.to_checksum_address(os.getenv('ROUTER_ADDRESS'))
USDC_ADDRESS = Web3.to_checksum_address(os.getenv('USDC_ADDRESS'))

router = web3.eth.contract(address=ROUTER_ADDRESS, abi=router_abi)
```

## 4) Read-only calls
```python
# Example: get a user's subscriptions
subs = router.functions.getUserSubscriptions('0xUser').call()
```

## 5) Sending transactions (server-signed)
```python
from eth_account import Account
from web3 import Web3
import os

private_key = os.getenv('PRIVATE_KEY')
account = Account.from_key(private_key)

# Example: create a subscription (payer must be the signer)
nonce = web3.eth.get_transaction_count(account.address)
tx = router.functions.createSubscription(
    Web3.to_checksum_address('0xRecipient'),
    50_000_000,   # 50 USDC with 6 decimals
    30,           # days
    'PayFlow sub',
).build_transaction({
    'from': account.address,
    'nonce': nonce,
    'gas': 500_000,
    'maxFeePerGas': web3.to_wei('2', 'gwei'),
    'maxPriorityFeePerGas': web3.to_wei('1', 'gwei'),
})

signed = web3.eth.account.sign_transaction(tx, private_key)
hash_ = web3.eth.send_raw_transaction(signed.rawTransaction)
receipt = web3.eth.wait_for_transaction_receipt(hash_)
```

## 6) User-signed flow (recommended)
Backend returns calldata, frontend signs & sends from the user's wallet.
```python
# Build calldata for sendPayment(recipient, amount, memo)
calldata = router.encodeABI(
    fn_name='sendPayment',
    args=[Web3.to_checksum_address('0xRecipient'), 50_000_000, 'memo']
)
# Return to frontend along with target contract address
```
Frontend uses wallet to submit `to=ROUTER_ADDRESS`, `data=calldata`, `value=0`.

## 7) Approvals
Because `PaymentRouter` pulls USDC with `transferFrom`, the user must approve the router on USDC first.
- Build calldata for `approve(router, amount)` on USDC ERC20.
- Or guide the frontend to call approve before calling router.

## 8) Escrow examples
```python
escrow_address = Web3.to_checksum_address('0xEscrow')
escrow = web3.eth.contract(address=escrow_address, abi=escrow_abi)

# Create an escrow (user-signed preferred)
calldata = escrow.encodeABI(
    fn_name='createEscrow',
    args=[
        Web3.to_checksum_address('0xFreelancer'),
        3_000_000_000, # 3000 USDC
        30,            # days until deadline
        'Freelance project',
        True,
        'Deliver v1',
    ],
)

# Read details
payer, recipient, amount, createdAt, deadline, status, desc, requiresMilestone, milestoneCompleted = escrow.functions.getEscrow(0).call()
```

## 9) Error handling tips
- Always checksum addresses.
- Validate chainId and RPC health.
- Set gas and EIP-1559 fees explicitly.
- Use small `maxFeePerGas` on testnet to avoid overspend.
- Parse revert reasons from receipts for better logs.
