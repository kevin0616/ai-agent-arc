import axios from 'axios';

const walletId = 'b89e6292-6c33-5264-bbcd-af3b86e33060'

async function testBalance() {
  try {
    //const walletId = 'b89e6292-6c33-5264-bbcd-af3b86e33060'
    const res = await axios.post('http://localhost:3000/balance', {walletId})
    console.log('Balance Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

async function testTXs() {
  try {
    //const walletID = 'b89e6292-6c33-5264-bbcd-af3b86e33060'
    const res = await axios.post('http://localhost:3000/transactions', {walletId})
    console.log('TXs Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testTXs();
