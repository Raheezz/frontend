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
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await register(form);
      setSuccess("✅ Registration successful! Please wait for admin approval.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Register</h1>

        {error && <p className="mb-4 text-sm text-center text-red-600">{error}</p>}
        {success && <p className="mb-4 text-sm text-center text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            name="last_name"
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
