// Minimal ElevenLabs client for TTS and STT from the frontend

// TEMPORARY HARDCODED - Remove after testing
const ELEVEN_API_KEY = 'sk_eda508f961d93dbc4019244eab8a1f4492a1d2e4eff55bc8';
// Default voice can be changed in .env (e.g., Rachel)
const ELEVEN_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

function assertApiKey() {
  if (!ELEVEN_API_KEY) {
    throw new Error('Missing VITE_ELEVENLABS_API_KEY in .env');
  }
}

export async function synthesizeSpeech(text) {
  assertApiKey();
  console.log('🔊 TTS Request - Text:', text);
  console.log('🔑 API Key:', ELEVEN_API_KEY.substring(0, 15) + '...' + ELEVEN_API_KEY.substring(ELEVEN_API_KEY.length - 4));
  console.log('📏 API Key length:', ELEVEN_API_KEY.length);
  console.log('🎙️ Voice ID:', ELEVEN_VOICE_ID);
  
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`;
  console.log('📡 TTS URL:', url);
  
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
  
  console.log('📡 TTS Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ TTS Error response:', errorText);
    throw new Error(`TTS request failed: ${res.status} - ${errorText}`);
  }
  
  const blob = await res.blob();
  console.log('✅ TTS audio blob received:', blob.size, 'bytes');
  return URL.createObjectURL(blob);
}

export async function transcribeAudioBlob(audioBlob) {
  assertApiKey();
  console.log('🔑 Using API key:', ELEVEN_API_KEY.substring(0, 15) + '...' + ELEVEN_API_KEY.substring(ELEVEN_API_KEY.length - 4));
  console.log('📏 API Key length:', ELEVEN_API_KEY.length);
  console.log('📦 Audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
  
  const form = new FormData();
  form.append('file', audioBlob, 'audio.webm');
  form.append('model_id', 'scribe_v1'); // Required parameter for STT
  
  // Optional params
  // form.append('language', 'en');
  
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_API_KEY },
    body: form,
  });
  
  console.log('📡 STT Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ STT Error response:', errorText);
    throw new Error(`STT request failed: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('📝 STT Response data:', data);
  // Expected shape: { text: 'transcript ...', ... }
  return data.text || '';
}


