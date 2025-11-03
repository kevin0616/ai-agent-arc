import axios from 'axios';

const walletId = '4561515d-18da-5cb6-ad8f-4e5d721ac373'
const walletAddress = '0x0df365759741b4725a0ed0f2966213065e8669b0'

async function testBalance() {
  try {
    const res = await axios.post('http://localhost:3000/balance', {walletId})
    console.log('Balance Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

async function testTXs() {
  try {
    const res = await axios.post('http://localhost:3000/transactions', {walletId})
    console.log('TXs Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

async function register() {
  try {
    //const walletID = 'b89e6292-6c33-5264-bbcd-af3b86e33060'
    const username = 'kevin123'
    const password = 'password'
    const res = await axios.post('http://localhost:3000/create-wallet', {username, password})
    //console.log('TXs Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}


async function buy() {
  try {
    const amount = '2'
    const res = await axios.post('http://localhost:3000/buy-usdc', {walletAddress, amount})
    console.log('Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}


async function sell() {
  try {
    const amount = '2'
    const res = await axios.post('http://localhost:3000/sell-usdc', {walletId, amount})
    console.log('Result:', res.data)
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

sell();
