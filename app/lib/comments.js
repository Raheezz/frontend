import api from "./api";

export const getComments = () => api.get("/api/comments/");
export const createComment = (data) => api.post("/api/comments/", data);
