import api from "./api";

// 🔹 Get all posts
export const getPosts = () => api.get("posts/");

// 🔹 Create a new post (supports JSON or FormData)
export const createPost = (data) => {
  if (data instanceof FormData) {
    return api.post("posts/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("posts/", data);
};

// 🔹 Update a post
export const updatePost = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`posts/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`posts/${id}/`, data);
};

// 🔹 Delete a post
export const deletePost = (id) => api.delete(`posts/${id}/`);

// 🔹 Toggle like on a post
export const toggleLike = (id) =>
  api.post(`posts/${id}/toggle_like/`).then((res) => res.data);

// 🔹 Get a single post by ID
export const getPostById = (id) =>
  api.get(`posts/${id}/`).then((res) => res.data);
