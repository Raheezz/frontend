"use client";

import { useEffect, useState } from "react";
import { getMe, updateMe } from "../../lib/auth";
import { getPosts, toggleLike } from "../../lib/posts";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";

function ProfileContent() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [posts, setPosts] = useState([]);
  const [dark, setDark] = useState(false);

  // ✅ Detect current theme from document
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    async function fetchUserAndPosts() {
      try {
        const data = await getMe();
        setUser(data);
        setBio(data.bio || "");

        // Fetch posts by this user
        const allPosts = await getPosts();
        const userPosts = (allPosts.results || allPosts).filter(
          (p) => p.author?.id === data.id
        );
        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
      }
    }
    fetchUserAndPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      const updated = await updateMe(formData);
      setUser(updated);
      setMessage("✅ Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile. Try again.");
      setMessageType("error");
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const updated = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes_count: updated.likes_count, is_liked: updated.is_liked }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (!user) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          dark ? "text-gray-300 bg-gray-900" : "text-gray-600 bg-gray-50"
        }`}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-8 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div
        className={`max-w-2xl mx-auto p-8 rounded-2xl shadow-md border ${
          dark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"
        }`}
      >
        <h1
          className={`text-2xl font-bold text-center mb-6 ${
            dark ? "text-blue-400" : "text-blue-700"
          }`}
        >
          My Profile
        </h1>

        {/* Avatar and info */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar ? URL.createObjectURL(avatar) : user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className={`w-24 h-24 rounded-full object-cover border shadow-sm mb-2 ${
              dark ? "border-gray-600" : "border-blue-200"
            }`}
          />
          <p className={`${dark ? "text-gray-200" : "text-gray-800"} text-lg font-semibold`}>
            {user.first_name} {user.last_name}
          </p>
          <p className={`${dark ? "text-gray-400" : "text-gray-500"} text-sm`}>{user.email}</p>
        </div>

        {/* Status message */}
        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              messageType === "success"
                ? "text-green-500"
                : messageType === "error"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className={`w-full p-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${
              dark
                ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-400"
                : "bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-300"
            }`}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio..."
            className={`w-full p-3 rounded-lg text-sm focus:outline-none focus:ring-2 ${
              dark
                ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-400"
                : "bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-300"
            }`}
          />
          <button
            type="submit"
            className={`w-full p-2 rounded-lg transition-colors ${
              dark
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Save Changes
          </button>
        </form>

        {/* User's posts */}
        <div>
          <h2 className={`${dark ? "text-gray-200" : "text-gray-900"} text-xl font-semibold mb-4`}>
            My Posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className={`${dark ? "text-gray-400" : "text-gray-500"}`}>
              You haven't created any posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`block p-4 rounded-xl transition ${
                    dark ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <h3 className={`${dark ? "text-gray-200" : "text-gray-800"} font-semibold`}>
                    {post.title}
                  </h3>
                  <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm line-clamp-2`}>
                    {post.content}
                  </p>
                  <div className={`flex items-center justify-between mt-1 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1 font-medium ${
                        post.is_liked ? "text-red-600" : dark ? "text-gray-400" : "text-gray-500"
                      } hover:underline`}
                    >
                      ❤️ {post.likes_count || 0}
                    </button>
                    <span>💬 {post.comments_count || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
