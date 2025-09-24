"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/feed");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Register user
      await registerUser(form);

      // Step 2: Auto-login with the same credentials
      const res = await loginUser({
        username: form.username,
        password: form.password,
      });

      // Save tokens + approval status
      localStorage.setItem("accessToken", res.access);
      localStorage.setItem("refreshToken", res.refresh);
      localStorage.setItem("isApproved", res.is_approved ? "true" : "false");

      alert(
        res.is_approved
          ? "✅ Registration complete! You are approved and logged in."
          : "✅ Registration successful! You are logged in, but must wait for admin approval to post."
      );

      // Redirect to feed
      router.push("/feed");
    } catch (err) {
      if (err.response?.data) {
        // Show the first error message from backend
        const firstError = Object.values(err.response.data)[0][0];
        setError(`❌ ${firstError}`);
      } else {
        setError("❌ Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Register
        </h1>

        {error && (
          <p className="mb-4 text-sm text-center text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />

          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          <input
            name="last_name"
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 text-gray-900 placeholder-gray-500 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-green-600 text-white p-2 rounded 
                       hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
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
