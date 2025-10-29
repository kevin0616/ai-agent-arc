# Hackathon Resources Checklist (Arc + USDC + AI Agents)

## Core Links
- **Arc Docs**: `https://docs.arcblockchain.xyz` (replace with official link)
- **Arc Testnet RPC**: `https://rpc-test-1.archiechain.io`
- **Block Explorer / Chain Info**: `https://coinfactory.app/en/chainlist/1244` (Archiescan public explorer TBD)
- **USDC on Arc (testnet)**: TBD (not yet officially released on public testnet)
- **ElevenLabs Docs**: `https://elevenlabs.io/docs`

## Local Setup
- [ ] Node + npm installed
- [ ] Python 3.10+ (if using Python backend)
- [ ] Foundry installed (`forge -V`)
- [ ] `.env` configured:
  - Frontend: `VITE_ELEVENLABS_API_KEY`, `VITE_ELEVENLABS_VOICE_ID`
  - Backend: `RPC_URL`, `PRIVATE_KEY`, `ROUTER_ADDRESS`, `USDC_ADDRESS`

## Smart Contracts
- [ ] `contracts/src/PaymentRouter.sol` compiled
- [ ] `contracts/src/EscrowContract.sol` compiled
- [ ] Deploy to Arc testnet (record addresses)
- [ ] Verify on explorer (when Archiescan public)
- [ ] Share addresses in `contracts/README.md`

## Frontend
- [ ] Wallet connect works (MetaMask on Arc testnet)
- [ ] viem helpers wired to `PaymentRouter`
- [ ] ElevenLabs voice:
  - [ ] STT for voice input
  - [ ] TTS for AI replies/confirmations
- [ ] Pages present: `ChatPage`, `WalletPage`, `HistoryPage`

## Backend (optional or stub)
- [ ] RPC connection alive
- [ ] ABI loaded for contract calls
- [ ] Routes for chat/intent (stub ok)

## Demo Scenarios (target 3)
- [ ] Simple payment: "Send $50 to Alice"
- [ ] Split payment: "Split $240 4 ways"
- [ ] Escrow: "Escrow $3000 for freelance project"
- Voice: Each scenario operable via voice input and voice confirmation

## Sponsor Alignment (ElevenLabs)
- [ ] Lifelike TTS for assistant
- [ ] STT for commands
- [ ] Brief slide/README section: why voice improves UX

## Video & Deck
- [ ] 5‑min demo video (shows on-chain tx on Arc)
- [ ] 10‑slide pitch deck (problem, solution, architecture, why Arc, demo screenshots)
- [ ] Links placed in root `README.md`

## Submission Readiness
- [ ] Public GitHub repo
- [ ] `README.md` with quickstart + contract addresses
- [ ] All links work (video, deck, explorer)
- [ ] Final checklist passed before deadline
