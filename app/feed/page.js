"use client";
import { useContext, useEffect, useState } from "react";
import { getPosts } from "../lib/posts";
import { AuthContext } from "../../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";


function FeedContent() {
  const { user } = useContext(AuthContext); // 👈 to check if logged in
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data.results || data); // handle pagination or array
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Campus Feed 📚</h1>

      {/* ✅ Show add button only if logged in */}
      {user && (
        <Link
          href="/posts/new"
          className="inline-block mb-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Post
        </Link>
      )}

      {/* Posts list */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-300">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="mt-2 rounded"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">
                By {post.author_name} •{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}

// ✅ Wrap with ProtectedRoute but make it public
export default function FeedPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <FeedContent />
    </ProtectedRoute>
  );
}
