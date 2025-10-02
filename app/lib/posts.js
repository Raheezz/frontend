import api from "./api";

// 🔹 Get all posts (with author, likes_count, comments_count)
export const getPosts = async () => {
  const res = await api.get("posts/");
  // Map posts to include comments_count safely if backend doesn't provide
  const posts = res.data.results || res.data;
  const mapped = posts.map((p) => ({
    ...p,
    likes_count: p.likes_count ?? 0,
    comments_count: p.comments_count ?? 0,
    author_name: p.author?.username || "Unknown",
    author: p.author || null,
  }));
  return { ...res.data, results: mapped };
};

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

// 🔹 Get a single post by ID (with author, likes, comments)
export const getPostById = (id) =>
  api.get(`posts/${id}/`).then((res) => ({
    ...res.data,
    likes_count: res.data.likes_count ?? 0,
    comments_count: res.data.comments_count ?? 0,
  }));
