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

  // ✅ Initialize dark mode
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  useEffect(() => {
    async function fetchUserAndPosts() {
      try {
        const data = await getMe();
        setUser(data);
        setBio(data.bio || "");
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
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 p-8 rounded-2xl shadow-md transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-6">
            My Profile
          </h1>
        </div>

        {/* Avatar and info */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : user.avatar || "/default-avatar.png"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border border-blue-200 dark:border-gray-600 shadow-sm mb-2"
          />
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>

        {/* Status message */}
        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              messageType === "success"
                ? "text-green-600 dark:text-green-400"
                : messageType === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-yellow-600 dark:text-yellow-400"
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
            className="w-full p-2 border rounded-lg text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio..."
            className="w-full p-3 border rounded-lg text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>

        {/* User's posts */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
            My Posts ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              You haven't created any posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="block p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1 font-medium ${
                        post.is_liked ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
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
