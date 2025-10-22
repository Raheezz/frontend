"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await login({ username, password });
      setSuccess("✅ Login successful!");
      if (!user?.is_verified) {
        setSuccess("✅ Login successful! Your account is pending admin approval.");
      }
      setTimeout(() => router.push("/"), 1500);
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
    <div className="flex items-center justify-center min-h-screen px-4" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="w-full max-w-md rounded-2xl shadow-md p-8 border section-card">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--accent)" }}>Login</h1>

        {error && <p className="mb-4 text-sm text-center" style={{ color: "#f87171" }}>{error}</p>}
        {success && <p className="mb-4 text-sm text-center" style={{ color: "#4ade80" }}>{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg text-sm focus:outline-none"
            style={{
              background: "var(--accent-light)",
              color: "var(--foreground)",
              border: "1px solid var(--accent)",
              transition: "box-shadow 0.2s",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg text-sm focus:outline-none"
            style={{
              background: "var(--accent-light)",
              color: "var(--foreground)",
              border: "1px solid var(--accent)",
              transition: "box-shadow 0.2s",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 rounded-lg transition-colors"
            style={{
              background: "var(--accent)",
              color: "#fff",
              opacity: loading ? 0.5 : 1,
            }}
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
