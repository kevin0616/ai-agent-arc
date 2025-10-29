import React from 'react'

const QuickActions = () => {

  const actions = [
    "💸 Pay $50 to Alice",
    "🍽️ Split bill 3 ways",
    "💼 Create escrow $1000",
    "📅 Schedule payment",
  ];

  return (
    <>
      {/* <div className="flex gap-2 overflow-x-auto p-4 bg-gray-100 border-t">
      {actions.map((a) => (
        <button
          key={a}
          className="whitespace-nowrap bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          {a}
        </button>
      ))}
    </div> */}
    <div className="flex gap-3 overflow-x-auto p-4 bg-bg">
      {actions.map((a) => (
        <button
          key={a}
          className="whitespace-nowrap bg-white border text-body px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition"
        >
          <span className="text-sm">{a}</span>
        </button>
      ))}
    </div>
    </>
  )
}

export default QuickActions
