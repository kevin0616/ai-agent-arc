import React from 'react'
import TransactionCard from "../components/TransactionCard";
import BalanceDisplay from "../components/BalanceDisplay";
import WalletConnect from "../components/WalletConnect";
import { NavLink } from 'react-router-dom';

const HistoryPage = () => {

  const transactions = [
    { type: "pay", amount: 50, status: "success", timestamp: "Oct 25 2025" },
    { type: "escrow", amount: 200, status: "pending", timestamp: "Oct 27 2025" },
    { type: "pay", amount: 80, status: "failed", timestamp: "Oct 28 2025" },
  ];

  return (
    <>
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

       <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
      {transactions.map((tx, i) => (
        <TransactionCard key={i} tx={tx} />
      ))}
    </div>
    </>
  )
}

export default HistoryPage
