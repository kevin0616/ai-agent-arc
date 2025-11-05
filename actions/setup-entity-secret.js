const { generateEntitySecret } = require("@circle-fin/developer-controlled-wallets");

console.log('\n🔐 Generating Entity Secret for Circle...\n');

// This will print out a new entity secret and sample code to register the entity secret
generateEntitySecret();

console.log('\n✅ Save the entity secret above for your .env file!\n');
