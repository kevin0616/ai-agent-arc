import { ethers } from 'ethers';
import { ARC_NETWORK, USDC_ADDRESS } from '../config/networks';
import USDC_ABI from '../abis/usdc.json'; // We'll create this next

// USDC ABI (simplified with common functions)
export const USDC_ABI = [
  // ERC20 standard functions
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

// Initialize ethers provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return new ethers.providers.JsonRpcProvider(ARC_NETWORK.rpcUrls[0]);
};

// Get signer for transactions
export const getSigner = async () => {
  const provider = getProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
};

// Get USDC contract instance
export const getUsdcContract = (signerOrProvider) => {
  return new ethers.Contract(USDC_ADDRESS, USDC_ABI, signerOrProvider);
};

// Get USDC balance for an address
export const getUsdcBalance = async (address) => {
  try {
    const provider = getProvider();
    const contract = getUsdcContract(provider);
    const balance = await contract.balanceOf(address);
    return parseFloat(ethers.utils.formatUnits(balance, 6)); // USDC has 6 decimals
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return 0;
  }
};

// Send USDC to another address
export const sendUsdc = async (toAddress, amount) => {
  try {
    const signer = await getSigner();
    const contract = getUsdcContract(signer);
    
    // Convert amount to USDC decimals (6)
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 6);
    
    // Check if we need to approve first
    const allowance = await contract.allowance(await signer.getAddress(), toAddress);
    if (allowance.lt(amountInWei)) {
      const approveTx = await contract.approve(toAddress, amountInWei);
      await approveTx.wait();
    }
    
    // Send the transaction
    const tx = await contract.transfer(toAddress, amountInWei);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash,
      message: 'Transaction successful!'
    };
  } catch (error) {
    console.error('Error sending USDC:', error);
    return {
      success: false,
      error: error.message,
      message: 'Transaction failed. Please try again.'
    };
  }
};

// Get transaction history for an address
export const getTransactionHistory = async (address) => {
  try {
    const provider = getProvider();
    const contract = getUsdcContract(provider);
    
    // Get Transfer events for this address
    const filter = contract.filters.Transfer(address, null);
    const sentEvents = await contract.queryFilter(filter);
    
    const receivedFilter = contract.filters.Transfer(null, address);
    const receivedEvents = await contract.queryFilter(receivedFilter);
    
    // Combine and sort events
    const allEvents = [...sentEvents, ...receivedEvents].sort((a, b) => 
      b.blockNumber - a.blockNumber || b.transactionIndex - a.transactionIndex
    );
    
    // Process events into transaction objects
    const transactions = await Promise.all(
      allEvents.slice(0, 50).map(async (event) => {
        const block = await provider.getBlock(event.blockNumber);
        const isSender = event.args.from.toLowerCase() === address.toLowerCase();
        
        return {
          hash: event.transactionHash,
          from: event.args.from,
          to: event.args.to,
          amount: parseFloat(ethers.utils.formatUnits(event.args.value, 6)),
          timestamp: block.timestamp * 1000, // Convert to milliseconds
          status: 'completed',
          type: isSender ? 'send' : 'receive',
        };
      })
    );
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

// Add Arc network to wallet
export const addArcNetwork = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('No crypto wallet found. Please install MetaMask.');
    }
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [ARC_NETWORK],
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error adding Arc network:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to add Arc network. Please add it manually in your wallet.'
    };
  }
};
