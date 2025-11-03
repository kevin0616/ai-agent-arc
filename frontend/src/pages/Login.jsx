import React, { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    console.log("Logging in user:", form);
    // TODO: Connect to backend API (next step)
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Welcome Back</h2>
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
        />
        <AuthButton text="Login" onClick={handleLogin} />
        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
