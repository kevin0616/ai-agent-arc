import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUsdcBalance, getTransactionHistory } from '../lib/blockchain';

export default function BalanceDisplay() {
  const { address } = useAccount();
  const [showDetails, setShowDetails] = useState(false);
  const [balance, setBalance] = useState('0.00');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch USDC balance and transactions
  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch balance
        const usdcBalance = await getUsdcBalance(address);
        setBalance(usdcBalance.toFixed(2));
        
        // Fetch recent transactions
        const txHistory = await getTransactionHistory(address);
        setTransactions(txHistory);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [address]);

  if (!address) return null;

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Wallet balance"
      >
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
        <span className="font-medium">
          {isLoading ? '...' : `${balance} USDC`}
        </span>
      </button>

      {showDetails && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Wallet Balance</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="text-2xl font-bold mb-4">
            {isLoading ? '...' : `${balance} USDC`}
          </div>
          
          <div className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</div>
          <div className="space-y-2 max-h-60 overflow-y-auto -mx-2 px-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            ) : transactions.length > 0 ? (
              transactions.slice(0, 3).map((tx, i) => (
                <div 
                  key={i} 
                  className="text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    // Open transaction in block explorer
                    window.open(`https://explorer.arc.network/tx/${tx.hash}`, '_blank');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-full ${tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'receive' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 8.586V3a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-600">
                        {tx.type === 'receive' ? 'Received from' : 'Sent to'} {formatAddress(tx.type === 'receive' ? tx.from : tx.to)}
                      </span>
                    </div>
                    <span className={`font-medium ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 ml-6 mt-0.5">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No recent transactions
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
            <button 
              onClick={() => {
                setShowDetails(false);
                window.location.href = '/wallet';
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Transactions
            </button>
            <button 
              onClick={() => {
                // Copy address to clipboard
                navigator.clipboard.writeText(address);
                // Could add a toast notification here
              }}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              title="Copy address"
            >
              <span>{formatAddress(address)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2v-2a1 1 0 112 0v2a4 4 0 01-4 4H6a4 4 0 01-4-4V5a4 4 0 014-4h4a1 1 0 011 1z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
