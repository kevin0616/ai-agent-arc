# 💻 Frontend Setup - PayFlow AI

## For Person 2: Frontend Developer

---

## 🚀 **Quick Start**

### **1. Install Dependencies:**
```bash
cd frontend
yarn install

# Additional packages needed for Arc + USDC
yarn add wagmi viem @rainbow-me/rainbowkit
yarn add @tanstack/react-query
yarn add zustand axios
yarn add lucide-react
```

### **2. Run Development Server:**
```bash
yarn dev
# Open http://localhost:3000
```

---

## 📦 **Required Packages**

### **Core:**
- `next` (15.5.4) - React framework
- `react` (19.1.0) - UI library
- `typescript` - Type safety

### **Wallet & Blockchain:**
- `wagmi` - React hooks for Ethereum
- `viem` - TypeScript Ethereum library
- `@rainbow-me/rainbowkit` - Wallet connection UI

### **State & API:**
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `axios` - HTTP client

### **UI:**
- `tailwindcss` (v4) - Styling
- `lucide-react` - Icons

---

## 🏗️ **Project Structure**

```
frontend/
├── src/
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper with providers
│   │   ├── index.tsx             # Main chat interface
│   │   ├── wallet.tsx            # Wallet management page
│   │   └── history.tsx           # Transaction history
│   │
│   ├── components/
│   │   ├── ChatInterface.tsx     # Main chat UI
│   │   ├── MessageBubble.tsx     # Individual messages
│   │   ├── WalletConnect.tsx     # Connect wallet button
│   │   ├── BalanceDisplay.tsx    # USDC balance
│   │   ├── TransactionCard.tsx   # Transaction display
│   │   ├── QuickActions.tsx      # Preset commands
│   │   └── LoadingSpinner.tsx    # Loading states
│   │
│   ├── hooks/
│   │   ├── useArcWallet.ts       # Arc wallet connection
│   │   ├── useUSDCBalance.ts     # Get USDC balance
│   │   ├── useContracts.ts       # Smart contract instances
│   │   ├── useChat.ts            # Chat state management
│   │   └── useTransactions.ts    # Transaction history
│   │
│   ├── lib/
│   │   ├── contracts.ts          # Contract ABIs & addresses
│   │   ├── api.ts                # Backend API client
│   │   ├── chains.ts             # Arc network config
│   │   └── formatters.ts         # Format numbers, addresses
│   │
│   ├── store/
│   │   └── chatStore.ts          # Zustand store for chat
│   │
│   └── styles/
│       └── globals.css           # Global styles
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
└── package.json
```

---

## ⚙️ **Arc Network Configuration**

### **File: `lib/chains.ts`**
```typescript
import { defineChain } from 'viem'

export const arcTestnet = defineChain({
  id: 123456, // Replace with actual Arc testnet chain ID
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.arc-testnet.example.com'], // Replace with actual RPC
    },
    public: {
      http: ['https://rpc.arc-testnet.example.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arc Explorer',
      url: 'https://explorer.arc-testnet.example.com',
    },
  },
  testnet: true,
})
```

---

## 🔗 **Contract Configuration**

### **File: `lib/contracts.ts`**
```typescript
export const contracts = {
  PaymentRouter: {
    address: '0x...', // Get from Person 1 after deployment
    abi: [...], // Import from Person 1's artifacts
  },
  EscrowContract: {
    address: '0x...',
    abi: [...],
  },
  USDC: {
    address: '0x...', // USDC contract on Arc
    abi: [...],
  },
}
```

---

## 🎨 **UI Components to Build**

### **1. ChatInterface.tsx**
Main chat interface where users type commands

**Features:**
- Message input field
- Send button
- Message history
- Typing indicators
- Auto-scroll

### **2. WalletConnect.tsx**
Wallet connection button with Arc support

**Features:**
- Connect/disconnect button
- Show connected address
- Switch network if wrong chain
- Display connection status

### **3. BalanceDisplay.tsx**
Show user's USDC balance

**Features:**
- Current balance in USDC
- Formatted with $ symbol
- Refresh button
- Loading state

### **4. MessageBubble.tsx**
Individual chat messages

**Features:**
- User messages (right-aligned, blue)
- AI responses (left-aligned, gray)
- Timestamp
- Transaction links if applicable
- Status indicators (pending, success, error)

### **5. TransactionCard.tsx**
Display transaction details

**Features:**
- Amount
- Recipient
- Status
- Timestamp
- Link to block explorer
- Transaction type icon

### **6. QuickActions.tsx**
Preset command buttons

**Examples:**
- "Pay $50 to Alice"
- "Split bill 3 ways"
- "Check my balance"
- "Create escrow $1000"

---

## 🔌 **API Integration**

### **File: `lib/api.ts`**
```typescript
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  // Send message to AI agent
  sendMessage: async (message: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      message,
    })
    return response.data
  },

  // Get transaction history
  getTransactions: async (address: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/transactions/${address}`)
    return response.data
  },

  // Check transaction status
  getTransactionStatus: async (txHash: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/transaction/${txHash}`)
    return response.data
  },
}
```

---

## 🪝 **Custom Hooks**

### **useArcWallet.ts**
```typescript
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useArcWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    connect,
    disconnect,
    connectors,
  }
}
```

### **useUSDCBalance.ts**
```typescript
import { useBalance } from 'wagmi'
import { contracts } from '@/lib/contracts'

export function useUSDCBalance(address?: string) {
  const { data, isLoading, refetch } = useBalance({
    address: address as `0x${string}`,
    token: contracts.USDC.address as `0x${string}`,
  })

  return {
    balance: data?.formatted || '0',
    symbol: data?.symbol || 'USDC',
    isLoading,
    refetch,
  }
}
```

---

## 🎯 **User Flow**

### **1. Landing Page:**
```
[PayFlow AI Logo]
Chat with AI to make payments on Arc

[Connect Wallet Button]

Once connected:
→ Redirect to chat interface
```

### **2. Chat Interface:**
```
┌─────────────────────────────────────────┐
│ PayFlow AI                    [Balance] │
├─────────────────────────────────────────┤
│                                         │
│  AI: Hello! How can I help with        │
│      payments today?                    │
│                                         │
│                     You: Send $50 to    │
│                          Alice          │
│                                         │
│  AI: ✅ Sent 50 USDC to alice.eth      │
│      Tx: 0xabc...                      │
│                                         │
├─────────────────────────────────────────┤
│ [Type your command...]         [Send]  │
└─────────────────────────────────────────┘

[Quick Actions]
[💸 Pay] [🍽️ Split] [💼 Escrow] [📅 Subscribe]
```

---

## 🎨 **Design Guidelines**

### **Colors:**
- **Primary:** Blue (#3B82F6) - Actions, buttons
- **Success:** Green (#10B981) - Completed transactions
- **Warning:** Yellow (#F59E0B) - Pending transactions
- **Error:** Red (#EF4444) - Failed transactions
- **Background:** Light gray (#F9FAFB)
- **Text:** Dark gray (#111827)

### **Typography:**
- **Headings:** Bold, 24-32px
- **Body:** Regular, 14-16px
- **Code/Addresses:** Monospace, 12-14px

### **Spacing:**
- Use Tailwind spacing scale (4, 8, 16, 24, 32px)
- Consistent padding/margins

---

## 🧪 **Testing Checklist**

### **Wallet Connection:**
- [ ] Connect wallet shows modal
- [ ] Correct network detected
- [ ] Wrong network prompts switch
- [ ] Disconnect works
- [ ] Reconnect on page refresh

### **Chat Interface:**
- [ ] Messages send correctly
- [ ] AI responses appear
- [ ] Auto-scroll to latest message
- [ ] Enter key sends message
- [ ] Input clears after send

### **Transactions:**
- [ ] USDC balance displays
- [ ] Transaction history loads
- [ ] Pending transactions show spinner
- [ ] Completed transactions show checkmark
- [ ] Failed transactions show error

### **Responsive:**
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)

---

## 🚀 **Deployment**

### **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

### **Environment Variables:**
Add to Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## 📞 **Coordination with Other Team Members**

### **With Person 1 (Contracts):**
- Get contract addresses after deployment
- Import contract ABIs
- Test contract interactions
- Report any contract bugs

### **With Person 3 (Backend):**
- Agree on API endpoint structure
- Test WebSocket connection
- Handle API errors gracefully
- Share user feedback

### **With Person 4 (Demo):**
- Provide demo account
- Show key features
- Fix UI bugs for video
- Make it look amazing!

---

## 🏆 **Success Criteria**

### **Week 1:**
- [ ] Wallet connection working
- [ ] Chat interface built
- [ ] USDC balance displays
- [ ] Can send basic transactions

### **Week 2:**
- [ ] All features integrated
- [ ] Beautiful UI
- [ ] Mobile responsive
- [ ] Ready for demo video

---

**You got this, Person 2! Build something beautiful! 💻✨**
