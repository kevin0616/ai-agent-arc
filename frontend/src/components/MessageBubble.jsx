import React from 'react'

const MessageBubble = ( {sender = "ai", text = ""}) => {

  const isUser = sender === "user";

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md wrap-break-word shadow-sm ${
          isUser
            ? "bg-gray-400 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
    </>
  )
}

export default MessageBubble
