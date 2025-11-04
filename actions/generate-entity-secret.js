// Script to generate Entity Secret for Circle
const crypto = require('crypto');

// Generate a random 32-byte (64 character) hex string
const entitySecret = crypto.randomBytes(32).toString('hex');

console.log('\n=================================');
console.log('🔐 Your Entity Secret:');
console.log('=================================');
console.log(entitySecret);
console.log('=================================');
console.log('\n⚠️  SAVE THIS SECURELY!');
console.log('You will need this for your .env file\n');

// Also save to a file
const fs = require('fs');
fs.writeFileSync('entity-secret.txt', entitySecret);
console.log('✅ Also saved to: entity-secret.txt\n');
