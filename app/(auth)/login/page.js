"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getMe } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/feed");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🔹 Step 1: Login
      const res = await loginUser({ username, password });

      // Save tokens in localStorage
      localStorage.setItem("accessToken", res.access);
      localStorage.setItem("refreshToken", res.refresh);

      // 🔹 Step 2: Fetch profile (to check verification)
      const profile = await getMe();
      localStorage.setItem("isApproved", profile.is_verified ? "true" : "false");

      // 🔹 Step 3: Redirect
      router.push("/feed");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(`❌ ${err.response.data.detail}`);
      } else {
        setError("❌ Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h1>

        {error && (
          <p className="mb-4 text-sm text-center text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white p-2 rounded 
                       hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
