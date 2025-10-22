"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [dark, setDark] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

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

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-blue-100 dark:border-gray-700 py-6 mt-10 text-center text-sm text-gray-600 dark:text-gray-300 transition-colors">
      <p className="mb-2">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          Jamia Project Magazine
        </span>{" "}
        · Built by Campus Creatives
      </p>

      {/* Dark Mode Toggle */}
    </footer>
  );
}
