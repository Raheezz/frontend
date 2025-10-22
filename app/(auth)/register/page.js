"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await register(form);
      setSuccess("✅ Registration successful! Please wait for admin approval.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      if (err.response?.data) {
        const firstError = Object.values(err.response.data)[0][0];
        setError(`❌ ${firstError}`);
      } else setError("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-md p-8"
        style={{
          background: "var(--background)",
          border: "1px solid var(--accent-light)",
          color: "var(--foreground)",
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "var(--accent)" }}
        >
          Register
        </h1>

        {error && (
          <p className="mb-4 text-sm text-center" style={{ color: "#f87171" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-sm text-center" style={{ color: "#34d399" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "email", "first_name", "last_name", "password"].map((field) => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              value={form[field]}
              onChange={handleChange}
              required={field !== "first_name" && field !== "last_name" ? true : false}
              className="w-full p-3 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                background: "var(--accent-light)",
                color: "var(--foreground)",
                border: "1px solid var(--accent)",
              }}
            />
          ))}

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
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
