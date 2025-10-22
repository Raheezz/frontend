"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // ✅ Prevent hydration mismatch by rendering user-dependent elements only after mount
  useEffect(() => setMounted(true), []);

  // ✅ Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // ✅ Toggle dark mode
  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-blue-100 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Home */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-700 via-sky-500 to-blue-400 bg-clip-text text-transparent select-none transform hover:scale-105 transition-transform duration-300"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.5px" }}
        >
          <span className="drop-shadow-sm">Jamia</span>
          <span className="ml-1 italic">Sparks</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 md:space-x-6 font-medium items-center text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
            Feed
          </Link>

          {mounted && user && (
            <Link href="/profile" className="hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
              Profile
            </Link>
          )}

          {mounted && user?.is_verified ? (
            <Link
              href="/post/new"
              className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={handleNavClick}
            >
              + Create Post
            </Link>
          ) : mounted && user ? (
            <span className="text-sm text-yellow-600">Pending Approval</span>
          ) : null}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            {dark ? "☀️" : "🌙 "}
          </button>

          {mounted &&
            (loading ? null : user ? (
              <button
                onClick={() => logout(router)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  onClick={handleNavClick}
                >
                  Register
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-blue-700 dark:text-blue-400 text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-700 px-6 py-4 space-y-4 text-center shadow-md transition-colors"
          >
            <Link href="/" className="block hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
              Feed
            </Link>

            {mounted && user && (
              <Link href="/profile" className="block hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
                Profile
              </Link>
            )}

            {mounted && user?.is_verified ? (
              <Link
                href="/post/new"
                className="block font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={handleNavClick}
              >
                + Create Post
              </Link>
            ) : mounted && user ? (
              <span className="block text-sm text-yellow-600">Pending Approval</span>
            ) : null}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {mounted &&
              (loading ? null : user ? (
                <button
                  onClick={() => {
                    logout(router);
                    handleNavClick();
                  }}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="block hover:text-blue-600 dark:hover:text-blue-400" onClick={handleNavClick}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                    onClick={handleNavClick}
                  >
                    Register
                  </Link>
                </>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
