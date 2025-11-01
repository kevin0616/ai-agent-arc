import { getWalletClient } from './viemClient'
import PaymentRouterABI from './PaymentRouterABI.json'
import { parseUnits } from 'viem'

export async function approveUsdc({ usdcAddress, routerAddress, amountUSDC6 }) {
  const wallet = getWalletClient()
  const [account] = await wallet.getAddresses()

  return wallet.writeContract({
    address: usdcAddress,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ],
    functionName: 'approve',
    args: [routerAddress, amountUSDC6],
    account
  })
}

export async function sendPayment({ routerAddress, recipient, amountDecimal, memo = '' }) {
  const wallet = getWalletClient()
  const [account] = await wallet.getAddresses()
  const amountUSDC6 = parseUnits(String(amountDecimal), 6)

  return wallet.writeContract({
    address: routerAddress,
    abi: PaymentRouterABI,
    functionName: 'sendPayment',
    args: [recipient, amountUSDC6, memo],
    account
  })
}


