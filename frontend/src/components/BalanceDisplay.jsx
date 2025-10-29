import React from 'react'

const BalanceDisplay = ({balance = "0.00"}) => {
  return (
    <>
      <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
      Balance: ${balance} USDC
    </div>
    {/* <div className="bg-gray-50 px-3 py-2 rounded-md text-sm font-medium border">
      <div className="text-xs text-gray-500">Balance</div>
      <div className="text-base font-semibold text-body">${balance} USDC</div>
    </div> */}
    </>
  )
}

export default BalanceDisplay
