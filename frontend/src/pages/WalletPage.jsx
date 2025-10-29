import React from 'react'
import WalletConnect from "../components/WalletConnect";
import BalanceDisplay from "../components/BalanceDisplay";

const WalletPage = () => {
  return (
    <>
      <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Wallet Management</h2>
      <WalletConnect />
      <BalanceDisplay />
    </div>
    </>
  )
}

export default WalletPage
