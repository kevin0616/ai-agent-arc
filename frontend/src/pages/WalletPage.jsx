import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import { getUsdcBalance } from '../utils/walletUtils';

const WalletPage = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch balance when address changes
  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }
    
    const fetchBalance = async () => {
      try {
        const bal = await getUsdcBalance(address);
        setBalance(bal);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">PayFlow Wallet</h1>
          <WalletConnect />
        </div>
        
        {isConnected ? (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-gray-600">Available Balance</h2>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : balance}
                </span>
                <span className="ml-2 text-lg text-gray-500">USDC</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Wallet: {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
                onClick={() => alert('Send functionality coming soon')}
              >
                Send
              </button>
              <button
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => alert('Receive functionality coming soon')}
              >
                Receive
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
              <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="p-4 text-center text-gray-500">
                  {isLoading ? 'Loading transactions...' : 'No recent transactions'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Connect your wallet to view your balance and transactions</p>
            <WalletConnect />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;