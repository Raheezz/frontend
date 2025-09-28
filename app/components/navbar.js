// app/components/navbar.js
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Home */}
        <Link href="/" className="text-xl font-bold">
          Campus Creatives
        </Link>

        {/* Links */}
        <div className="flex space-x-6">
          <Link href="/">Feed</Link> {/* ✅ Now always points to "/" */}

          {/* Show profile only if logged in */}
          {user && <Link href="/profile">Profile</Link>}

          {/* Only verified users can create posts */}
          {user?.is_verified ? (
            <Link href="/post/new" className="font-semibold text-green-400">
              + Create Post
            </Link>
          ) : user ? (
            <span className="text-sm text-yellow-400">Pending Approval</span>
          ) : null}
        </div>

        {/* Auth Buttons */}
        <div>
          {loading ? null : user ? (
            <button
              onClick={() => logout(router)} // ✅ redirect after logout
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
