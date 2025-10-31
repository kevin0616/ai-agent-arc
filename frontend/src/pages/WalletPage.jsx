import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NavLink } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import BalanceDisplay from '../components/BalanceDisplay';
import SendTransaction from '../components/SendTransaction';
import { getTransactionHistory } from '../utils/walletUtils';

const WalletPage = () => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [showSendModal, setShowSendModal] = useState(false);

  // Fetch transaction history
  useEffect(() => {
    if (!address) return;
    
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const txHistory = await getTransactionHistory(address);
        setTransactions(txHistory);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PayFlow AI</h1>
              <nav className="ml-8 flex space-x-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Chat
                </NavLink>
                <NavLink 
                  to="/wallet" 
                  className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Wallet
                </NavLink>
                <NavLink 
                  to="/history" 
                  className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  History
                </NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <BalanceDisplay />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
              <p className="mt-1 text-sm text-gray-500">Manage your USDC balance and transactions</p>
            </div>

            {isConnected ? (
              <div className="bg-gray-50">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'transactions'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Transactions
                    </button>
                    <button
                      onClick={() => setActiveTab('send')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'send'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Send USDC
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'transactions' ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                        <button
                          onClick={() => setShowSendModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Send USDC
                        </button>
                      </div>
                      
                      {isLoading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : transactions.length > 0 ? (
                        <div className="overflow-hidden bg-white shadow sm:rounded-md">
                          <ul className="divide-y divide-gray-200">
                            {transactions.map((tx, index) => (
                              <li key={index}>
                                <a 
                                  href={`https://explorer.arc.network/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block hover:bg-gray-50"
                                >
                                  <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                          tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                          {tx.type === 'receive' ? (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                            </svg>
                                          ) : (
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 8.586V3a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                          )}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {tx.type === 'receive' ? 'Received from' : 'Sent to'} {formatAddress(tx.type === 'receive' ? tx.from : tx.to)}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {new Date(tx.timestamp).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ml-2 flex-shrink-0 flex">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          tx.type === 'receive' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {tx.type === 'receive' ? 'Received' : 'Sent'}
                                        </p>
                                      </div>
                                      <div className={`ml-2 flex-shrink-0 text-right`}>
                                        <p className={`text-sm font-medium ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} USDC
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {tx.status}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                          <p className="mt-1 text-sm text-gray-500">Get started by sending some USDC.</p>
                          <div className="mt-6">
                            <button
                              type="button"
                              onClick={() => setShowSendModal(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Send USDC
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white shadow sm:rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Send USDC</h3>
                        <div className="mt-5">
                          <SendTransaction />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No wallet connected</h3>
                <p className="mt-1 text-sm text-gray-500">Connect your wallet to view your balance and transactions.</p>
                <div className="mt-6">
                  <WalletConnect />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowSendModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowSendModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Send USDC
                  </h3>
                  <div className="mt-2">
                    <SendTransaction onSuccess={() => {
                      setShowSendModal(false);
                      // Refresh transactions
                      if (address) {
                        getTransactionHistory(address).then(setTransactions);
                      }
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
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
