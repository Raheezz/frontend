import api from "./api";

export const getPosts = () => api.get("/api/posts/");
export const createPost = (data) => api.post("/api/posts/", data);
export const updatePost = (id, data) => api.put(`/api/posts/${id}/`, data);
export const deletePost = (id) => api.delete(`/api/posts/${id}/`);
export const toggleLike = (id) => api.post(`/api/posts/${id}/toggle_like/`);
