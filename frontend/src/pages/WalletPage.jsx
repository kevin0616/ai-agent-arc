import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import { getUsdcBalance } from '../utils/walletUtils';
import axios from 'axios';

const WalletPage = () => {
  //const { address, isConnected } = useAccount();
  const user = JSON.parse(localStorage.getItem('user'))
  const isConnected = user.results
  const walletId = user.walletId
  const walletAddress = user.walletAddress
  const [balance, setBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [amount, setAmount] = useState('')
  const [transferAddress, setTransferAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')

  useEffect(() => {
    if (message) {
    const timer = setTimeout(() => {
    setMessage(null);
    setMessageType(null);
    }, 3000);
    return () => clearTimeout(timer);
    }
  }, [message])
      
  // Fetch balance when address changes
  useEffect(() => {
    /*if (!address) {
      setIsLoading(false);
      return;
    }*/
    
    const fetchBalance = async () => {
      try {
        const res = await axios.post('http://localhost:3000/balance', {walletId})
        setBalance(res.data)
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
      }finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const buy = async() => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage('Please enter a valid amount!')
      setMessageType('error')
      return
    }
    try {
      const res = await axios.post('http://localhost:3000/buy-usdc', {walletAddress, amount})
      console.log('Result:', res.data)
      setMessage('Buy Successful!')
      setMessageType('success')
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setMessage('Buy Failed!')
      setMessageType('error')
    }
  }

  const sell = async() => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage('Please enter a valid amount!')
      setMessageType('error')
      return
    }
    try {
      const res = await axios.post('http://localhost:3000/sell-usdc', {walletId, amount})
      console.log('Result:', res.data)
      setMessage('Sell Successful!')
      setMessageType('success')
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setMessage('Sell Failed!')
      setMessageType('error')
    }
  }

  const transfer = async() => {
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) {
      setMessage('Please enter a valid amount!')
      setMessageType('error')
      return
    }
    try {
      const res = await axios.post('http://localhost:3000/send', {walletId, transferAmount, transferAddress})
      console.log('Result:', res.data)
      setMessage('Transfer Successful!')
      setMessageType('success')
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setMessage('Transfer Failed!')
      setMessageType('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">PayFlow Wallet</h1>
          {/*<WalletConnect />*/}
        </div>
        {message && (
        <div className={`p-3 mb-4 rounded-lg text-white ${messageType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
        {message}
        </div>
        )}
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
                  Wallet: {walletAddress}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full col-span-2 border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
                onClick={() => sell()}
              >
                Sell
              </button>
              <button
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => buy()}
              >
                Buy
              </button>
            </div>

            {/* Recent Transactions */}
            {/* <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
              <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                <div className="p-4 text-center text-gray-500">
                  {isLoading ? 'Loading transactions...' : 'No recent transactions'}
                </div>
              </div>
            </div> */}
            {/* Transfer */}
            <div>
              To:<input
                type="text"
                placeholder="Enter address"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="w-full col-span-2 border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full col-span-2 border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
                onClick={() => transfer()}
              >
                Transfer
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            {/*<p className="text-gray-600 mb-4">Connect your wallet to view your balance and transactions</p>*/}
            <p className="text-gray-600 mb-4">Login to view your balance and transactions</p>
            {/*<WalletConnect />*/}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;