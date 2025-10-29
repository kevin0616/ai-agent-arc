import React from 'react'
import TransactionCard from "../components/TransactionCard";

const HistoryPage = () => {

  const transactions = [
    { type: "pay", amount: 50, status: "success", timestamp: "Oct 25 2025" },
    { type: "escrow", amount: 200, status: "pending", timestamp: "Oct 27 2025" },
    { type: "pay", amount: 80, status: "failed", timestamp: "Oct 28 2025" },
  ];

  return (
    <>
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
