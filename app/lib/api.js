// lib/api.js
import axios from "axios";

// Only root domain, no /api here
const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_ROOT}/api/`, // this will add /api correctly
  withCredentials: false,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" && localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: try refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) {
        return Promise.reject(error);
      }
      try {
        const resp = await axios.post(`${API_ROOT}/api/auth/token/refresh/`, {
          refresh,
        });
        const newAccess = resp.data.access;
        localStorage.setItem("accessToken", newAccess);
        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
