# 🌟 PayFlow AI - AI Payment Agent on Arc Blockchain

**AI Agents on Arc with USDC Hackathon**  
**Prize:** $10,000 USDC | **Dates:** Oct 27 - Nov 9, 2025

---

## 🎯 What is PayFlow AI?

AI agents understand natural language and execute financial actions on Arc blockchain using USDC.

**Examples:**
- "Pay $500 to Alice" → Sends USDC
- "Split $240 4 ways" → Splits payment
- "Escrow $3000 for project" → Creates smart contract
- "Pay $15/month to Netflix" → Recurring subscription

---

## 📚 Documentation

1. **[CORRECT_HACKATHON.md](CORRECT_HACKATHON.md)** - Hackathon info
2. **[ARC_HACKATHON_README.md](ARC_HACKATHON_README.md)** - Full project details
3. **[TEAM_STRUCTURE.md](TEAM_STRUCTURE.md)** - Team roles (4 people)
4. **[docs/HACKATHON_RESOURCES_CHECKLIST.md](docs/HACKATHON_RESOURCES_CHECKLIST.md)** - Arc RPC, explorer, USDC, demo checklist
5. **[docs/CONNECT_CONTRACT_FRONTEND.md](docs/CONNECT_CONTRACT_FRONTEND.md)** - Frontend ↔ contracts (viem)
6. **[docs/CONNECT_CONTRACT_BACKEND.md](docs/CONNECT_CONTRACT_BACKEND.md)** - Backend ↔ contracts (web3.py)
7. **[docs/ELEVENLABS_INTEGRATION.md](docs/ELEVENLABS_INTEGRATION.md)** - Voice (ElevenLabs) setup & usage

---

## 👥 Team Roles

- **Person 1:** Smart Contracts (Solidity on Arc)
- **Person 2:** Frontend (React + Wallet)
- **Person 3:** AI & Backend (GPT-4 + FastAPI)
- **Person 4:** Demo & Integration (Video + Pitch)

---

## 🏗️ Tech Stack

- **Blockchain:** Arc (USDC as gas)
- **Contracts:** Solidity ✅ (2 complete)
- **Frontend:** Next.js + TypeScript
- **AI:** GPT-4 / Claude
- **Backend:** Python FastAPI

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/kevin0616/ai-agent-arc.git

# Person 1: Contracts
cd contracts

# Person 2: Frontend
cd frontend && npm install
cp .env.local.example .env.local  # create if missing
## Add your ElevenLabs API key:
## VITE_ELEVENLABS_API_KEY=sk_...
## VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
npm run dev

# Person 3: Backend
cd backend && pip install -r requirements.txt
```

---

## 📁 Structure

```
├── contracts/          Person 1 (Smart Contracts)
├── frontend/           Person 2 (UI/UX)
├── backend/            Person 3 (AI & API)
└── presentation/       Person 4 (Demo)
```

---

## 🏆 Let's Win $10,000 USDC!

Read the full docs to get started! 🚀
