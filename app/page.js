// app/page.js
"use client";

import { useEffect, useState } from "react";
import { getPosts } from "./lib/posts";
import { getMe } from "./lib/auth";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Always load posts
        const postData = await getPosts();
        setPosts(postData.results || postData);

        // Only fetch user if logged in
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("accessToken");
          if (token) {
            try {
              const userData = await getMe();
              setUser(userData);
            } catch {
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📚 Campus Feed
      </h1>

      {/* Only verified users can create posts */}
      {user?.is_verified && (
        <Link
          href="/post/new"
          className="inline-block mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Create Post
        </Link>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {post.content.length > 120
                  ? post.content.slice(0, 120) + "..."
                  : post.content}
              </p>
              <div className="mt-3 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>✍️ {post.author?.username || "Unknown"}</span>
                <span>❤️ {post.likes_count || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
