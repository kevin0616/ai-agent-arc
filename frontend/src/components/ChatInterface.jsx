import React from 'react'
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import BalanceDisplay from "./BalanceDisplay";
import WalletConnect from "./WalletConnect";

const ChatInterface = () => {
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="PayFlow AI" className="w-8 h-8" />
          <h1 className="text-xl font-semibold">PayFlow AI</h1>
        </div>
        <div className="flex items-center gap-3">
          <BalanceDisplay />
          <WalletConnect />
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <MessageBubble sender="ai" text="👋 Hello! How can I help with payments today?" />
        <MessageBubble sender="user" text="Send $50 to Alice" />
        <MessageBubble sender="ai" text="✅ Payment of 50 USDC to alice.eth successful!" />
      </main>

      {/* Input */}
      <footer className="border-t bg-white p-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your command..."
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-blue-500"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          Send
        </button>
      </footer>

      {/* Quick actions */}
      <QuickActions />
    </div>
    </>
  )
}

export default ChatInterface
