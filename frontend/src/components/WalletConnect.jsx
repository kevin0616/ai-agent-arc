import React, { useEffect, useState } from 'react'

export default function WalletConnect() {
  const [account, setAccount] = useState('')

  const connect = async () => {
    if (!window.ethereum) return alert('No wallet found')
    const accs = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accs[0] || '')
  }

  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.on?.('accountsChanged', (accs) => setAccount(accs[0] || ''))
    return () => window.ethereum.removeListener?.('accountsChanged', () => {})
  }, [])

  const short = (a) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '')

  return (
    <button onClick={connect} className="px-3 py-2 border rounded">
      {account ? `Connected: ${short(account)}` : 'Connect Wallet'}
    </button>
  )
}

import React from 'react'

const WalletConnect = ({ connected = false, address }) => {
  
if (connected) {
    return (
      <div className="flex items-center gap-3 bg-white border px-3 py-2 rounded-md shadow-sm">
        <div className="font-mono text-sm">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "0x..."}</div>
        <div className="text-xs text-green-600 font-semibold">Connected</div>
      </div>
    );
  }

  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all">
      Connect Wallet
    </button>
  );
}

export default WalletConnect
