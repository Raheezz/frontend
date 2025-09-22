import api from "./api";

// Fetch a user's public profile by ID
export const getPublicProfile = (id) =>
  api.get(`auth/profile/${id}/`).then((res) => res.data);
