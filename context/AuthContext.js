"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  registerUser,
  getMe,
  logoutUser,
  refreshToken,
  isRefreshExpired
} from "../app/lib/auth";

import { useRouter } from "next/navigation";

// ✅ Export context so other files can import/use it
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Sync user <-> localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔹 Logout helper
  const logout = () => {
    logoutUser(router);
    setUser(null);
  };

  // 🔹 Try refreshing tokens
  const tryRefresh = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh || isRefreshExpired()) {
      logout();
      return;
    }
    try {
      await refreshToken({ refresh });
      const me = await getMe();
      setUser(me);
    } catch (err) {
      console.error("Refresh failed:", err);
      logout();
    }
  };

  // 🔹 On first load, check auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isRefreshExpired()) {
          logout();
          setUser(null);
        } else {
          const refresh = localStorage.getItem("refreshToken");
          if (refresh) {
            const me = await getMe();
            setUser(me);
          } else {
            setUser(null); // guest
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
        await tryRefresh();
        setUser(null); // allow guest
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
    const tokens = await loginUser(credentials);
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    const me = await getMe();
    setUser(me);
  };

  // 🔹 Register
  const register = async (data) => {
    const tokens = await registerUser(data);
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    const me = await getMe();
    setUser(me);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for easy access in components
export const useAuth = () => useContext(AuthContext);
