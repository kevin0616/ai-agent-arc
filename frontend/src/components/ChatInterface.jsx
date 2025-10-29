import React from 'react'
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import BalanceDisplay from "./BalanceDisplay";
import WalletConnect from "./WalletConnect";
// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const ChatInterface = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-bg text-body">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
          <div className="flex items-center gap-3">
            {/* <img src="/logo.svg" alt="PayFlow AI" className="w-9 h-9" /> */}
            <h1 className="font-bold text-2xl md:text-3xl">PayFlow AI</h1>
          </div>

          <nav className="space-x-6">
            <NavLink to="/" className="hover:text-blue-400 transition">Chat</NavLink>
            <NavLink to="/wallet" className={({ isActive }) => isActive ? "text-blue-400 font-semibold" 
            : "text-gray-300 hover:text-blue-400"}>
              Wallet
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "text-blue-400 font-semibold" 
            : "text-gray-300 hover:text-blue-400"}>
              History
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <BalanceDisplay />
            <WalletConnect />
          </div>
        </header>

        {/* Chat area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-bg">
          <MessageBubble sender="ai" text="Hello! How can I help with payments today?" />
          <MessageBubble sender="user" text="Send $50 to Alice" />
          <MessageBubble sender="ai" text="Sent 50 USDC to alice.eth — Tx: 0xabc... " />
        </main>

        {/* Input */}
        <footer className="bg-white p-4 md:p-6 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your command..."
            className="border-t border-b flex-1 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Send
          </button>
        </footer>

        <QuickActions />
      </div>
    </>
  )
}

export default ChatInterface
