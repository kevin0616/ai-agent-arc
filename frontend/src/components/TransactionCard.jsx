import React from 'react'

const TransactionCard = ({tx}) => {

  const statusMap = {
    success: { text: "Success", color: "text-success" },
    pending: { text: "Pending", color: "text-warning" },
    failed:  { text: "Failed",  color: "text-danger" },
  };

  const status = statusMap[tx.status] || statusMap.pending;

  return (
    <>
      {/* <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
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
    </div> */}

    <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
      <div>
        <p className="text-base font-semibold text-body">
          {tx.type === "pay" ? "💸 Payment" : "💼 Escrow"} • <span className="text-sm text-gray-500">{tx.recipient}</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">{tx.timestamp}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-body">${tx.amount} USDC</p>
        <p className={`text-sm mt-1 ${status.color} font-medium`}>{status.text}</p>
        <a className="block mt-2 text-xs font-mono text-gray-500 hover:underline" href={tx.explorer} target="_blank" rel="noreferrer">
          {tx.txHash ? `${tx.txHash.slice(0,8)}...${tx.txHash.slice(-6)}` : "View"}
        </a>
      </div>
    </div>
    </>
  )
}

export default TransactionCard
