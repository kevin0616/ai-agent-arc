import React from 'react'

const MessageBubble = ( {sender, text}) => {

  const isUser = sender === "user";

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md wrap-break-word shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}
        <p className="text-[10px] text-gray-600 mt-1 text-right opacity-75">
          {isUser ? "You" : "AI"}
        </p>
      </div>
    </div>
    </>
  )
}

export default MessageBubble
