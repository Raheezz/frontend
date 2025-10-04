"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Home */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 tracking-tight"
        >
          Jamia Sparks
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
          <Link href="/" className="hover:text-blue-600">
            Feed
          </Link>

          {user && (
            <Link href="/profile" className="hover:text-blue-600">
              Profile
            </Link>
          )}

          {user?.is_verified ? (
            <Link
              href="/post/new"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              + Create Post
            </Link>
          ) : user ? (
            <span className="text-sm text-yellow-600">Pending Approval</span>
          ) : null}

          {loading ? null : user ? (
            <button
              onClick={() => logout(router)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-6 py-4 space-y-4">
          <Link href="/" className="block hover:text-blue-600">
            Feed
          </Link>

          {user && (
            <Link href="/profile" className="block hover:text-blue-600">
              Profile
            </Link>
          )}

          {user?.is_verified ? (
            <Link
              href="/post/new"
              className="block font-semibold text-blue-600 hover:text-blue-800"
            >
              + Create Post
            </Link>
          ) : user ? (
            <span className="block text-sm text-yellow-600">
              Pending Approval
            </span>
          ) : null}

          {loading ? null : user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                logout(router);
              }}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
