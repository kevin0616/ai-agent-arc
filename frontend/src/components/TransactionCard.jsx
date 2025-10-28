import React from 'react'

const TransactionCard = ({tx}) => {

  const statusColors = {
    success: "text-green-600",
    pending: "text-yellow-600",
    failed: "text-red-600",
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
      <div>
        <p className="text-gray-900 font-medium">
          {tx.type === "pay" ? "💸 Payment" : "💼 Escrow"}
        </p>
        <p className="text-sm text-gray-500">{tx.timestamp}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">${tx.amount} USDC</p>
        <p className={`text-sm ${statusColors[tx.status]}`}>
          {tx.status.toUpperCase()}
        </p>
      </div>
    </div>
    </>
  )
}

export default TransactionCard
