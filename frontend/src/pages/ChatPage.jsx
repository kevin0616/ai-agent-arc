import React, { useRef, useState, useEffect } from 'react'
import { synthesizeSpeech, transcribeAudioBlob } from '../lib/elevenlabsClient'
import ChatInterface from "../components/ChatInterface";

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const [textInput, setTextInput] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    // Check if ElevenLabs API key is loaded
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    if (apiKey) {
      console.log('✅ ElevenLabs API Key loaded:', apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4))
      console.log('📏 Key length:', apiKey.length, 'characters')
    } else {
      console.error('❌ ElevenLabs API Key NOT loaded! Check your .env file')
      alert('Warning: ElevenLabs API Key not found. Voice features may not work.')
    }
  }, [])
  const startRecording = async () => {
    try {
      console.log('🎤 Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('✅ Microphone access granted')
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('📊 Audio data received:', e.data.size, 'bytes')
          audioChunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped')
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        console.log('📦 Audio blob size:', blob.size, 'bytes')
        
        try {
          console.log('🔄 Transcribing audio...')
          const text = await transcribeAudioBlob(blob)
          console.log('📝 Transcription result:', text)
          
          if (text) {
            setMessages((m) => [...m, { role: 'user', content: text }])
            // Here you would call your AI/backend to handle intent and execute
            const reply = `Heard: ${text}`
            setMessages((m) => [...m, { role: 'assistant', content: reply }])
            
            try {
              console.log('🔊 Synthesizing speech...')
              const url = await synthesizeSpeech(reply)
              console.log('✅ Speech synthesized:', url)
              const audio = new Audio(url)
              audio.play()
            } catch (error) {
              console.error("❌ Error playing audio:", error)
              alert('Error playing audio: ' + error.message)
            }
          }
        } catch (error) {
          console.error('❌ Error transcribing audio:', error)
          alert('Error transcribing audio: ' + error.message)
        }
      }
      
      mediaRecorder.start()
      setRecording(true)
      console.log('🔴 Recording started')
    } catch (error) {
      console.error('❌ Error accessing microphone:', error)
      alert('Microphone access denied or not available. Please allow microphone permission and try again.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const sendText = async () => {
    const content = textInput.trim()
    if (!content) return
    
    console.log('📤 Sending text:', content)
    setMessages((m) => [...m, { role: 'user', content }])
    setTextInput('')
    
    // Here you would call your AI/backend to handle intent and execute
    const reply = `You typed: ${content}`
    setMessages((m) => [...m, { role: 'assistant', content: reply }])
    
    try {
      console.log('🔊 Synthesizing text reply...')
      const url = await synthesizeSpeech(reply)
      console.log('✅ Speech synthesized:', url)
      const audio = new Audio(url)
      audio.play()
    } catch (error) {
      console.error('❌ Error with text-to-speech:', error)
      alert('Error with text-to-speech: ' + error.message)
    }
  }

  return (
    <>
    <ChatInterface />
    <div className="p-6 space-y-4">
      <div className="text-xl font-semibold">Voice-enabled Chat</div>
      <div className="space-x-2 items-center flex">
        {!recording ? (
          <button onClick={startRecording} className="px-3 py-2 bg-blue-600 text-white rounded">Start Mic</button>
        ) : (
          <button onClick={stopRecording} className="px-3 py-2 bg-red-600 text-white rounded">Stop</button>
        )}
      </div>
      <div className="border rounded p-3 space-y-2 min-h-[120px]">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className="text-sm opacity-70 mr-2">{m.role}:</span>
            <span>{m.content}</span>
          </div>
        ))}
        {!messages.length && <div className="opacity-60">Speak a message to get started…</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendText() }}
        />
        <button onClick={sendText} className="px-3 py-2 bg-green-600 text-white rounded">Send</button>
      </div>
    </div>
    </>

    // <ChatInterface
    //   messages={messages}
    //   recording={recording}
    //   onStartRecording={startRecording}
    //   onStopRecording={stopRecording}
    // />
  )
}

export default ChatPage
