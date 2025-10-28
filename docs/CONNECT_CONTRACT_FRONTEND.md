# Connect Smart Contracts to Frontend (React + Vite)

This guide shows how to call `PaymentRouter` from the frontend using `viem`.

## 1) Deploy and export ABI
- Deploy `PaymentRouter` and note the deployed address (e.g., `0x...`).
- After `forge build`, copy `abi` from `contracts/out/PaymentRouter.sol/PaymentRouter.json`.
- Save it as `frontend/src/lib/PaymentRouterABI.json`.

## 2) Install dependency
```bash
cd frontend
npm i viem
```

## 3) Create a wallet/public client
Create `frontend/src/lib/viemClient.js`:
```javascript
import { createWalletClient, custom, createPublicClient, http } from 'viem';

export const getWalletClient = () => {
  if (!window.ethereum) throw new Error('No wallet found');
  return createWalletClient({ transport: custom(window.ethereum) });
};

export const getPublicClient = (rpcUrl) =>
  createPublicClient({ transport: http(rpcUrl) });
```

## 4) Minimal contract helpers
Create `frontend/src/lib/contracts.js`:
```javascript
import { getWalletClient } from './viemClient';
import PaymentRouterABI from './PaymentRouterABI.json' assert { type: 'json' };
import { parseUnits } from 'viem';

export async function approveUsdc({ usdcAddress, routerAddress, amountUSDC6 }) {
  const wallet = getWalletClient();
  const [account] = await wallet.getAddresses();

  return wallet.writeContract({
    address: usdcAddress,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'approve',
    args: [routerAddress, amountUSDC6],
    account,
  });
}

export async function sendPayment({ routerAddress, recipient, amountDecimal, memo = '' }) {
  const wallet = getWalletClient();
  const [account] = await wallet.getAddresses();
  const amountUSDC6 = parseUnits(String(amountDecimal), 6);

  return wallet.writeContract({
    address: routerAddress,
    abi: PaymentRouterABI,
    functionName: 'sendPayment',
    args: [recipient, amountUSDC6, memo],
    account,
  });
}
```

## 5) Example UI usage
Example (e.g., `frontend/src/pages/WalletPage.jsx`):
```javascript
import { useState } from 'react';
import { approveUsdc, sendPayment } from '../lib/contracts';

const ROUTER_ADDRESS = '0xYourRouter';
const USDC_ADDRESS = '0xUsdcOnArc';

export default function WalletPage() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('50');
  const [status, setStatus] = useState('');

  const onApprove = async () => {
    try {
      setStatus('Approving...');
      const txHash = await approveUsdc({
        usdcAddress: USDC_ADDRESS,
        routerAddress: ROUTER_ADDRESS,
        amountUSDC6: BigInt(Number(amount) * 1_000_000),
      });
      setStatus(`Approve sent: ${txHash}`);
    } catch (e) { setStatus(e.message); }
  };

  const onSend = async () => {
    try {
      setStatus('Sending...');
      const txHash = await sendPayment({
        routerAddress: ROUTER_ADDRESS,
        recipient: to,
        amountDecimal: amount,
        memo: 'PayFlow',
      });
      setStatus(`Payment tx: ${txHash}`);
    } catch (e) { setStatus(e.message); }
  };

  return (
    <div>
      <input placeholder="Recipient" value={to} onChange={(e)=>setTo(e.target.value)} />
      <input placeholder="Amount (USDC)" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      <button onClick={onApprove}>Approve USDC</button>
      <button onClick={onSend}>Send Payment</button>
      <div>{status}</div>
    </div>
  );
}
```

## 6) Notes
- Switch MetaMask to Arc testnet, use real Arc USDC address.
- Because `PaymentRouter` uses `transferFrom`, users must approve USDC to the router first.
- For better UX, consider `wagmi` + `RainbowKit` later.
