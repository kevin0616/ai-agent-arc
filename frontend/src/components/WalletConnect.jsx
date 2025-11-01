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

