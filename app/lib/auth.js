// lib/auth.js
import api from "./api";

// 🔹 Register a new student
export const registerUser = (data) =>
  api.post("auth/register/", data).then((res) => res.data);

// 🔹 Login -> returns tokens
export const loginUser = (data) =>
  api.post("auth/token/", data).then((res) => res.data);

// 🔹 Refresh access token
export const refreshToken = (data) =>
  api.post("auth/token/refresh/", data).then((res) => res.data);

// 🔹 Get current user profile
export const getMe = () =>
  api.get("auth/me/").then((res) => res.data);

// 🔹 Update current user profile
export const updateMe = (formData) =>
  api.patch("auth/me/", formData).then((res) => res.data);
