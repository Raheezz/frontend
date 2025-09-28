import axios from "axios";
import { isRefreshExpired, handleLogout } from "./auth";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_ROOT}/api/`,
  withCredentials: false, // using JWT in headers, not cookies
});

// 🔹 Attach access token if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (process.env.NODE_ENV === "development") {
        console.log("🔑 Attached access token");
      }
    } else {
      delete config.headers.Authorization;
    }
  }
  return config;
});

// 🔹 Handle 401 with token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (typeof window !== "undefined") {
        const refresh = localStorage.getItem("refreshToken");

        if (!refresh || isRefreshExpired()) {
          if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ Refresh token missing/expired, logging out...");
          }
          handleLogout();
          return Promise.reject(error);
        }

        try {
          if (process.env.NODE_ENV === "development") {
            console.log("🔄 Trying token refresh...");
          }

          const resp = await axios.post(`${API_ROOT}/api/auth/token/refresh/`, { refresh });
          const newAccess = resp.data.access;

          if (newAccess) {
            localStorage.setItem("accessToken", newAccess);

            // ✅ Update headers
            api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            original.headers.Authorization = `Bearer ${newAccess}`;

            if (process.env.NODE_ENV === "development") {
              console.log("✅ Token refreshed, retrying request...");
            }

            return api(original);
          }
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("❌ Token refresh failed, logging out...", err);
          }
          handleLogout();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
