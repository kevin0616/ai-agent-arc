// Minimal ElevenLabs client for TTS and STT from the frontend

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
// Default voice can be changed in .env (e.g., Rachel)
const ELEVEN_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

function assertApiKey() {
  if (!ELEVEN_API_KEY) {
    throw new Error('Missing VITE_ELEVENLABS_API_KEY in .env');
  }
}

export async function synthesizeSpeech(text) {
  assertApiKey();
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVEN_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    }),
  });
  if (!res.ok) throw new Error('TTS request failed');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function transcribeAudioBlob(audioBlob) {
  assertApiKey();
  const form = new FormData();
  form.append('file', audioBlob, 'audio.webm');
  // Optional params: diarize=true, language='en'
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_API_KEY },
    body: form,
  });
  if (!res.ok) throw new Error('STT request failed');
  const data = await res.json();
  // Expected shape: { text: 'transcript ...', ... }
  return data.text || '';
}


