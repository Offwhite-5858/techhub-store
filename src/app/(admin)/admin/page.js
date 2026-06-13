"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "techhub2024") {
      sessionStorage.setItem("techhub-admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">TechHub Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="mb-4">
            <label className="block text-dark-700 font-medium mb-2 text-sm">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm"
                autoFocus
              />
            </div>
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}
          <button type="submit" className="w-full bg-dark-900 text-white py-3 rounded-xl font-semibold hover:bg-dark-800 transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}