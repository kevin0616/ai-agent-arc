import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { sendUsdc, getUsdcBalance } from '../utils/walletUtils';

export default function SendTransaction() {
  const { address } = useAccount();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [balance, setBalance] = useState(0);

  // Fetch balance when address changes
  useEffect(() => {
    if (address) {
      const fetchBalance = async () => {
        const bal = await getUsdcBalance(address);
        setBalance(bal);
      };
      fetchBalance();
    }
  }, [address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAddress || !amount || parseFloat(amount) <= 0) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid amount and recipient address',
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Processing transaction...' });

    try {
      const result = await sendUsdc(toAddress, amount);
      
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Transaction successful!',
          txHash: result.txHash,
        });
        // Update balance after successful transaction
        const newBalance = await getUsdcBalance(address);
        setBalance(newBalance);
        // Clear form
        setToAddress('');
        setAmount('');
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'Transaction failed',
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Send USDC</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold">{balance.toFixed(2)} USDC</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USDC)
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={balance}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-24"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USDC</span>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Min: 0.01 USDC</span>
            <button 
              type="button" 
              onClick={() => setAmount(balance.toString())}
              className="text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              Max: {balance.toFixed(2)} USDC
            </button>
          </div>
        </div>
        
        {status.message && (
          <div 
            className={`p-3 rounded-lg ${
              status.type === 'error' 
                ? 'bg-red-50 text-red-700' 
                : status.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            <div className="flex items-center">
              {status.type === 'error' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {status.type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {status.type === 'info' && (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <span>{status.message}</span>
            </div>
            {status.txHash && (
              <div className="mt-2 text-sm">
                <a 
                  href={`https://explorer.arc.network/tx/${status.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !address}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            isLoading || !address
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : !address ? (
            'Connect Wallet to Send'
          ) : (
            'Send USDC'
          )}
        </button>
      </form>
    </div>
  );
}
