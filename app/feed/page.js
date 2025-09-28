"use client";
import { useContext, useEffect, useState } from "react";
import { getPosts } from "../lib/posts";
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Campus Feed 📚
      </h1>

      {/* ✅ Add Post Button (only for logged in users) */}
      {user && (
        <div className="flex justify-center mb-8">
          <Link
            href="/posts/new"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            ➕ Add Post
          </Link>
        </div>
      )}

      {/* Posts list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Post Content */}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.content}
                </p>

                {/* Footer Info */}
                <p className="text-xs text-gray-500 mt-4 border-t border-blue-50 pt-2">
                  By{" "}
                  <span className="font-medium text-blue-600">
                    {post.author_name}
                  </span>{" "}
                  • {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No posts yet.
          </p>
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
