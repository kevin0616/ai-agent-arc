# ElevenLabs Integration Guide (Voice AI for PayFlow)

## What we added
- Frontend mic recording in `frontend/src/pages/ChatPage.jsx`.
- ElevenLabs client in `frontend/src/lib/elevenlabsClient.js` for:
  - Text-to-Speech (TTS) → returns audio URL
  - Speech-to-Text (STT) → transcribes WebM blob

## Setup
1) Create `frontend/.env` and add:
```
VITE_ELEVENLABS_API_KEY=sk_...your_key...
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # optional default voice
```
2) Restart `npm run dev` after changing env.

## How it works (flow)
1. User clicks Start Mic → browser records audio (WebM).
2. On Stop, we POST audio to ElevenLabs STT → transcript.
3. Transcript is appended to chat and can be sent to AI/backend for intent + transaction.
4. Assistant reply is synthesized via ElevenLabs TTS and played in the chat.

## Why this helps (pros)
- Natural, hands‑free payments: speak commands like “Send 50 USDC to Alice.”
- Accessibility: voice guidance and confirmations.
- Demo impact: lifelike voice replies elevate the presentation.
- Sponsor alignment: qualifies for the ElevenLabs Voice AI challenge.
- Fast integration: minimal code, simple .env config.

## Example usage (TTS only)
```javascript
import { synthesizeSpeech } from '../lib/elevenlabsClient'
const url = await synthesizeSpeech('Payment sent successfully')
new Audio(url).play()
```

## Example usage (STT only)
```javascript
import { transcribeAudioBlob } from '../lib/elevenlabsClient'
const text = await transcribeAudioBlob(audioBlob)
```

## Notes
- Keep API key in frontend env for hackathon speed; for production use a backend proxy.
- Change voices by setting `VITE_ELEVENLABS_VOICE_ID`.
- Rate limits apply; cache short phrases client-side if needed.
