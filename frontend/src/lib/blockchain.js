import { createPublicClient, http, formatEther } from 'viem';
import { mainnet, polygon, arbitrum } from 'viem/chains';
import { USDC_ABI } from './contracts/usdc';

// Configure the client for Arc network
const arcChain = {
  id: 1243, // Replace with actual Arc chain ID
  name: 'Arc',
  network: 'arc',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.arc.network'], // Replace with actual Arc RPC URL
    },
    public: {
      http: ['https://rpc.arc.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://explorer.arc.network' },
  },
};

// Initialize the public client
export const publicClient = createPublicClient({
  chain: arcChain,
  transport: http(),
});

// USDC contract address on Arc
export const USDC_ADDRESS = '0xYourUsdcContractAddress'; // Replace with actual USDC contract on Arc

// Get USDC balance for an address
export const getUsdcBalance = async (address) => {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address],
    });
    
    // USDC has 6 decimals
    return Number(balance) / 1e6;
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return 0;
  }
};

// Get transaction history for an address
export const getTransactionHistory = async (address) => {
  try {
    // Get the current block number
    const blockNumber = await publicClient.getBlockNumber();
    
    // Get logs for USDC transfers
    const logs = await publicClient.getLogs({
      address: USDC_ADDRESS,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { type: 'address', name: 'from', indexed: true },
          { type: 'address', name: 'to', indexed: true },
          { type: 'uint256', name: 'value' },
        ],
      },
      args: {
        from: address,
        to: address,
      } as any, // Type assertion to handle indexed args
      fromBlock: blockNumber - 10000n, // Last ~24 hours of blocks (adjust as needed)
      toBlock: 'latest',
    });

    // Process logs into transaction objects
    const transactions = await Promise.all(
      logs.map(async (log) => {
        const block = await publicClient.getBlock({
          blockHash: log.blockHash,
        });

        const isSender = log.args.from?.toLowerCase() === address.toLowerCase();
        const otherParty = isSender ? log.args.to : log.args.from;
        const amount = Number(log.args.value) / 1e6; // Convert from wei to USDC (6 decimals)

        return {
          hash: log.transactionHash,
          from: log.args.from,
          to: log.args.to,
          amount: amount.toFixed(2),
          timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
          status: 'completed',
          type: isSender ? 'send' : 'receive',
        };
      })
    );

    // Sort by timestamp (newest first)
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

// Get transaction details by hash
export const getTransactionDetails = async (txHash) => {
  try {
    return await publicClient.getTransaction({
      hash: txHash,
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
};
