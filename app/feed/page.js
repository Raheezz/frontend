"use client";
import { useContext, useEffect, useState } from "react";
import { getPosts, toggleLike } from "../lib/posts";
import { AuthContext } from "../../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";

function FeedContent() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data.results || data);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    }
    fetchPosts();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8">
      <h1
         className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-700 via-sky-500 to-blue-400 bg-clip-text text-transparent"
      >
       Campus Feed 📚
      </h1>


      {/* ✅ Removed the extra ➕ Add Post button here */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">
                {/* Author Info */}
                <div className="flex items-center gap-2 mb-2">
                  {post.author?.avatar && (
                    <img
                      src={post.author.avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-medium text-blue-600">
                    {post.author?.username || post.author_name || "Unknown"}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.content}
                </p>

                {/* Footer with Like & Comment */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-blue-50 pt-2">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>

                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1 font-medium ${
                      post.is_liked ? "text-red-600" : "text-gray-500"
                    } hover:underline`}
                  >
                    ❤️ {post.likes_count || 0} Likes
                  </button>

                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-1 text-gray-500 hover:underline"
                  >
                    💬 {post.comments_count || 0} Comments
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <FeedContent />
    </ProtectedRoute>
  );
}
