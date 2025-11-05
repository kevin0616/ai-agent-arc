const { registerEntitySecretCiphertext } = require("@circle-fin/developer-controlled-wallets");
const fs = require('fs');

const apiKey = 'TEST_API_KEY:57a6c79793889553dc61b60612c5e51a:3bddf3addfb692be5dab628c5d714a1e';
const entitySecret = 'da2c071f44331263b8270d29fde79f8fc4f2f4dbc2391655a5ec383ba467cedd';

console.log('\n🔐 Registering Entity Secret with Circle...\n');

registerEntitySecretCiphertext({
  apiKey: apiKey,
  entitySecret: entitySecret
})
.then(response => {
  console.log('✅ Entity Secret registered successfully!\n');
  
  // Save recovery file
  if (response.data?.recoveryFile) {
    fs.writeFileSync('recovery_file.dat', response.data.recoveryFile);
    console.log('💾 Recovery file saved to: recovery_file.dat');
    console.log('⚠️  KEEP THIS FILE SAFE! You need it to recover your entity secret.\n');
  }
  
  console.log('Response:', JSON.stringify(response.data, null, 2));
  console.log('\n🎉 Setup complete! You can now create wallet sets.\n');
})
.catch(error => {
  console.error('❌ Error registering entity secret:', error.message);
  if (error.response) {
    console.error('Response:', JSON.stringify(error.response.data, null, 2));
  }
});
