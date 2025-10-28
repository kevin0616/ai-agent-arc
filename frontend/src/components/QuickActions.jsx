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
      <div className="flex gap-2 overflow-x-auto p-4 bg-gray-100 border-t">
      {actions.map((a) => (
        <button
          key={a}
          className="whitespace-nowrap bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          {a}
        </button>
      ))}
    </div>
    </>
  )
}

export default QuickActions
