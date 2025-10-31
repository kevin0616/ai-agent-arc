import React, { useState } from 'react'
import WalletConnect from "../components/WalletConnect";
import BalanceDisplay from "../components/BalanceDisplay";
import { NavLink } from "react-router-dom";
import { approveUsdc, sendPayment } from '../lib/contracts'

const WalletPage = () => {
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
      <h2 className="text-xl font-semibold">Wallet Management</h2>
      <WalletConnect />
      <BalanceDisplay />
      <PaymentActions />
    </div>
    </>
  )
}

export default WalletPage

// Simple approve + send UI
function PaymentActions() {
  const [router, setRouter] = useState('0xYourRouter')
  const [usdc, setUsdc] = useState('0xUsdcOnArc')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('50')
  const [status, setStatus] = useState('')

  const onApprove = async () => {
    try {
      setStatus('Approving...')
      const txHash = await approveUsdc({
        usdcAddress: usdc,
        routerAddress: router,
        amountUSDC6: BigInt(Math.floor(Number(amount) * 1_000_000))
      })
      setStatus(`Approve sent: ${txHash}`)
    } catch (e) {
      setStatus(e.message || 'Approve failed')
    }
  }

  const onSend = async () => {
    try {
      setStatus('Sending...')
      const txHash = await sendPayment({
        routerAddress: router,
        recipient: to,
        amountDecimal: amount,
        memo: 'PayFlow'
      })
      setStatus(`Payment tx: ${txHash}`)
    } catch (e) {
      setStatus(e.message || 'Send failed')
    }
  }

  return (
    <div className="mt-6 space-y-3 border rounded p-4">
      <div className="font-medium">Payment Actions</div>
      <input className="w-full border rounded px-3 py-2" placeholder="Router address" value={router} onChange={(e)=>setRouter(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="USDC address" value={usdc} onChange={(e)=>setUsdc(e.target.value)} />
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Recipient" value={to} onChange={(e)=>setTo(e.target.value)} />
        <input className="w-36 border rounded px-3 py-2" placeholder="Amount (USDC)" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button onClick={onApprove} className="px-3 py-2 bg-gray-800 text-white rounded">Approve USDC</button>
        <button onClick={onSend} className="px-3 py-2 bg-blue-600 text-white rounded">Send Payment</button>
      </div>
      <div className="text-sm opacity-75 break-all">{status}</div>
    </div>
  )
}
