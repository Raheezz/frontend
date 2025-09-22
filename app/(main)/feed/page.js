"use client";

import { useEffect, useState } from "react";
import { getPosts } from "../../lib/posts";
import { getMe } from "../../lib/auth";
import Link from "next/link";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postData = await getPosts();
        setPosts(postData.results || postData);

        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching data:", err);
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

      {/* Show "Create Post" only if user is verified */}
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
            <div
              key={post.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
