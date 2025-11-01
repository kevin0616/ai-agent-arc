import { createWalletClient, custom, createPublicClient, http } from 'viem'

export const getWalletClient = () => {
  if (!window.ethereum) throw new Error('No wallet found')
  return createWalletClient({ transport: custom(window.ethereum) })
}

export const getPublicClient = (rpcUrl) =>
  createPublicClient({ transport: http(rpcUrl) })


