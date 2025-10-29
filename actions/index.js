const {
  initiateDeveloperControlledWalletsClient,
  CreateTransferTransactionForDeveloperRequest,
} = require("@circle-fin/developer-controlled-wallets");
require('dotenv').config();
const express = require('express');

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET,
});

const app = express();
const port = 3000;

app.get('/balance', async (req, res) => {
    try {
        const response = await client.getWalletTokenBalance({
            id: 'b89e6292-6c33-5264-bbcd-af3b86e33060'
        });
        res.json(response.data.tokenBalances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/create-wallet', async (req, res) => {
    try {
        const response = await client.createWallets({
            blockchains: ['ARC-TESTNET'],
            count: 1,
            accountType: 'SCA',
            walletSetId: process.env.WALLET_SET_ID
        });
        res.json(response.data.wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/buy-usdc", async (req, res) => {
  try {
    const response = await client.createTransaction({
      walletId: 'b89e6292-6c33-5264-bbcd-af3b86e33060', // id from (DEX SIMULATE)
      tokenId: '15dc2b5d-0994-58b0-bf8c-3a0501148ee8', //usdc token id
      destinationAddress: '0x0263fd91c595ed132686147abb8fe8b39564b72b', //address to (MYWALLET)
      amounts: ['2'],
      fee: {
        type: 'level',
        config: {
          feeLevel: 'HIGH'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sell-usdc", async (req, res) => {
  try {
    const response = await client.createTransaction({
      walletId: '0f3c02e1-68be-5687-a550-4305e9c0ae30', // id from (MYWALLET)
      tokenId: '15dc2b5d-0994-58b0-bf8c-3a0501148ee8', //usdc token id
      destinationAddress: '0xf37a740f4c3f7afd7269cec210525f85cb03e57a', //address to (DEX SIMULATE)
      amounts: ['2'],
      fee: {
        type: 'level',
        config: {
          feeLevel: 'HIGH'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


