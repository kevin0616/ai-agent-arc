import React, { useRef, useState } from 'react'
import { synthesizeSpeech, transcribeAudioBlob } from '../lib/elevenlabsClient'

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const text = await transcribeAudioBlob(blob)
      if (text) {
        setMessages((m) => [...m, { role: 'user', content: text }])
        // Here you would call your AI/backend to handle intent and execute
        const reply = `Heard: ${text}`
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
        try {
          const url = await synthesizeSpeech(reply)
          const audio = new Audio(url)
          audio.play()
        } catch (error) {
          console.error("Error playing audio:", error)
        }
      }
    }
    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="text-xl font-semibold">Voice-enabled Chat</div>
      <div className="space-x-2">
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
    </div>
  )
}

export default ChatPage
