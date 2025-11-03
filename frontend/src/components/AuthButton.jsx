import React from "react";

export default function AuthButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
    >
      {text}
    </button>
  );
}
