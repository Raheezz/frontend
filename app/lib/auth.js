"use client";
import api from "./api";

// 🔹 Clear tokens + redirect
export const handleLogout = (router) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("user");
  }

  // ✅ Always redirect to login
  if (router) {
    router.push("/login"); // soft navigation
  } else {
    window.location.href = "/login"; // fallback
  }
};

// 🔹 Save tokens to localStorage
const saveTokens = ({ access, refresh }) => {
  if (typeof window !== "undefined") {
    if (access) {
      localStorage.setItem("accessToken", access);
      api.defaults.headers.Authorization = `Bearer ${access}`;
    }
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    }
  }
};

// 🔹 Decode JWT payload
const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// 🔹 Check if refresh token is expired
export const isRefreshExpired = () => {
  if (typeof window === "undefined") return true;
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return true;
  const payload = decodeJwt(refresh);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

// 🔹 Register new student
export const registerUser = async (data) => {
  const res = await api.post("auth/register/", data);
  saveTokens(res.data);
  return res.data;
};

// 🔹 Login
export const loginUser = async (data) => {
  const res = await api.post("auth/token/", data);
  saveTokens(res.data);
  return res.data;
};

// 🔹 Refresh access token
export const refreshToken = async ({ refresh }) => {
  try {
    const res = await api.post("auth/token/refresh/", { refresh });
    if (res.data.access) {
      saveTokens({ access: res.data.access, refresh });
    }
    return res.data;
  } catch (err) {
    handleLogout();
    throw err;
  }
};

// 🔹 Get current user profile
export const getMe = async () => {
  try {
    const res = await api.get("auth/me/");
    if (typeof window !== "undefined" && res.data?.is_verified !== undefined) {
      localStorage.setItem(
        "isVerified",
        res.data.is_verified ? "true" : "false"
      );
    }
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      handleLogout();
    }
    throw err;
  }
};

// 🔹 Update current user profile
export const updateMe = async (formData) => {
  const res = await api.patch("auth/me/", formData);
  if (res.data?.is_verified !== undefined) {
    localStorage.setItem("isVerified", res.data.is_verified ? "true" : "false");
  }
  return res.data;
};

// 🔹 Logout utility
export const logoutUser = (router) => {
  handleLogout(router);
};
