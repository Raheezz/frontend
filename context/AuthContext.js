"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  getMe,
  logoutUser,
  refreshToken,
  isRefreshExpired,
} from "@/lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Keep localStorage in sync whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔹 Helper: Try refreshing token & re-fetch user
  const tryRefresh = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh || isRefreshExpired()) {
      return logout();
    }

    try {
      await refreshToken({ refresh });
      const me = await getMe();
      setUser(me);
    } catch {
      logout();
    }
  };

  // 🔹 On first load, get user OR try refresh
  useEffect(() => {
    const initAuth = async () => {
      if (isRefreshExpired()) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        await tryRefresh();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // 🔹 Auto-refresh every 4 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      tryRefresh();
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Login
  const login = async (credentials) => {
    await loginUser(credentials);
    const me = await getMe();
    setUser(me);
  };

  // 🔹 Register
  const register = async (data) => {
    await registerUser(data);
    const me = await getMe();
    setUser(me);
  };

  // 🔹 Logout
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
