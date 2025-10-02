import api from "./api";

// 🔹 Get all comments (optionally filter by post)
export const getComments = (params = {}) =>
  api.get("comments/", { params }).then((res) => res.data);

// 🔹 Create a new comment
export const createComment = (data) =>
  api.post("comments/", data).then((res) => res.data);

// 🔹 Delete a comment by ID
export const deleteComment = (id) =>
  api.delete(`comments/${id}/`).then((res) => res.data);
