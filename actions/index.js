const {
  initiateDeveloperControlledWalletsClient,
} = require("@circle-fin/developer-controlled-wallets");
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors')

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
});

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

app.post('/create-wallet', async (req, res) => {
  const { username, password } = req.body;

  try {
    //create corresponding DCW wallet
    const response = await client.createWallets({
      blockchains: ['ARC-TESTNET'],
      count: 1,
      accountType: 'SCA',
      walletSetId: process.env.WALLET_SET_ID
    });
    const walletId = response.data.wallets[0].id
    const walletAddress = response.data.wallets[0].address
    //console.log(response.data.wallets)
    //create account in db
    const { data, error } = await supabase
      .from('Users')
      .insert([
        { walletAddress: walletAddress, walletId: walletId, username: username, password: password },
      ])
      .select()

    if (error) return res.status(500).json({ error: error.message });

    if (data.length > 0) {
      res.json({ results: true, creator: data[0] });
    } else {
      res.json({ results: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log(username, password)
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error) return res.status(500).json({ error: error.message });
    if (data) {
      res.json({ results: true, walletId: data.walletId, walletAddress: data.walletAddress, username: username });
    } else {
      res.json({ results: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/balance', async (req, res) => {
  const { walletId } = req.body
  console.log('📊 Balance request for walletId:', walletId)
  
  if (!walletId) {
    return res.status(400).json({ error: 'walletId is required' });
  }
  
  try {
    const response = await client.getWalletTokenBalance({
      id: walletId
    });
    console.log('✅ Balance response:', response.data.tokenBalances)
    if (response.data.tokenBalances.length == 0) {
      res.json(0)
    }
    else {
      res.json(response.data.tokenBalances[0].amount);
    }
  } catch (err) {
    console.error('❌ Balance error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.post('/transactions', async (req, res) => {
  const { walletId } = req.body
  try {
    const response = await client.listTransactions({
      walletIds: [walletId]
    });
    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/buy-usdc", async (req, res) => {
  const { walletAddress, amount } = req.body
  try {
    // For hackathon demo: Simulate getting USDC from faucet
    // In production, this would be a real DEX wallet transferring USDC
    
    // NOTE: This will fail if you don't have a funded DEX wallet
    // Alternative: Use Arc testnet faucet to fund wallets directly:
    // https://faucet.arc.xyz or similar testnet faucet
    
    res.json({ 
      message: "For demo: Use Arc testnet faucet to fund your wallet",
      faucetUrl: "https://faucet.arc.xyz",
      walletAddress: walletAddress,
      requestedAmount: amount,
      note: "Get free test USDC from the faucet and it will show in your balance and transaction history"
    })

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sell-usdc", async (req, res) => {
  const { walletId, amount, destinationAddress } = req.body
  console.log('💸 Send USDC request:', { walletId, amount, destinationAddress })
  
  if (!walletId || !amount) {
    return res.status(400).json({ error: 'walletId and amount are required' });
  }
  
  // Use provided destination or default to DEX simulate address
  const recipient = destinationAddress || '0xf37a740f4c3f7afd7269cec210525f85cb03e57a';
  
  try {
    const response = await client.createTransaction({
      walletId: walletId, // Sender wallet
      tokenId: '15dc2b5d-0994-58b0-bf8c-3a0501148ee8', // USDC token on Arc
      destinationAddress: recipient, // Recipient address
      amounts: [amount],
      fee: {
        type: 'level',
        config: {
          feeLevel: 'HIGH'
        }
      }
    });
    console.log('✅ Transaction created:', response.data)
    res.json(response.data)
  } catch (err) {
    console.error('❌ Transaction error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


