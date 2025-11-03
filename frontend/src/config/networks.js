export const ARBITRUM_MAINNET = {
  chainId: 42161,
  chainName: 'Arbitrum One',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io/'],
};

export const ARBITRUM_TESTNET = {
  chainId: 421613,
  chainName: 'Arbitrum Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://testnet.arbiscan.io/'],
};

// Update this with your Arc network configuration
export const ARC_NETWORK = {
  chainId: 1243, // Replace with actual Arc chain ID
  chainName: 'Arc Network',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.arc.network'], // Replace with actual Arc RPC URL
  blockExplorerUrls: ['https://explorer.arc.network/'],
};

export const SUPPORTED_NETWORKS = {
  1243: ARC_NETWORK,  // Arc
  42161: ARBITRUM_MAINNET,
  421613: ARBITRUM_TESTNET,
};

export const DEFAULT_NETWORK = 1243; // Arc network
export const USDC_ADDRESS = '0xYourUsdcContractAddress'; // USDC contract on Arc
