"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);

      const approved = localStorage.getItem("isApproved");
      setIsApproved(approved === "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isApproved");
    setIsLoggedIn(false);
    setIsApproved(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Home */}
        <Link href="/" className="text-xl font-bold">
          Campus Creatives
        </Link>

        {/* Links */}
        <div className="flex space-x-6">
          <Link href="/feed">Feed</Link>
          {isLoggedIn && <Link href="/profile">Profile</Link>}
          {isLoggedIn && isApproved && (
            <Link href="/post/new" className="font-semibold text-green-400">
              + Create Post
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
