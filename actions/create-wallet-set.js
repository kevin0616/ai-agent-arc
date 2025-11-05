const { initiateDeveloperControlledWalletsClient } = require("@circle-fin/developer-controlled-wallets");

const apiKey = 'TEST_API_KEY:57a6c79793889553dc61b60612c5e51a:3bddf3addfb692be5dab628c5d714a1e';
const entitySecret = 'da2c071f44331263b8270d29fde79f8fc4f2f4dbc2391655a5ec383ba467cedd';

const client = initiateDeveloperControlledWalletsClient({
  apiKey: apiKey,
  entitySecret: entitySecret
});

console.log('\n🏗️  Creating Wallet Set for Arc Testnet...\n');

client.createWalletSet({ name: 'PayFlow-Hackathon-WalletSet' })
  .then(response => {
    console.log('✅ Wallet Set created successfully!\n');
    console.log('📋 Wallet Set Details:');
    console.log('================================');
    console.log('Wallet Set ID:', response.data?.walletSet?.id);
    console.log('Name:', response.data?.walletSet?.name);
    console.log('Created:', response.data?.walletSet?.createDate);
    console.log('================================\n');
    
    console.log('🎯 SAVE THIS WALLET SET ID FOR YOUR .ENV FILE:\n');
    console.log(`WALLET_SET_ID=${response.data?.walletSet?.id}\n`);
    
    console.log('Full response:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error creating wallet set:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  });
