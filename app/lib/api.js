import axios from "axios";
import { isRefreshExpired, handleLogout } from "./auth";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_ROOT}/api/`,
  withCredentials: false,
});

// 🔹 Request interceptor: attach latest accessToken
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔹 Response interceptor: auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (typeof window !== "undefined") {
        const refresh = localStorage.getItem("refreshToken");

        if (!refresh || isRefreshExpired()) {
          handleLogout(); // no router here, safe fallback redirect
          return Promise.reject(error);
        }

        try {
          const resp = await axios.post(
            `${API_ROOT}/api/auth/token/refresh/`,
            { refresh }
          );
          const newAccess = resp.data.access;

          if (newAccess) {
            localStorage.setItem("accessToken", newAccess);
            api.defaults.headers.Authorization = `Bearer ${newAccess}`;
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original); // retry the request
          }
        } catch {
          handleLogout();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
