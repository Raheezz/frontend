"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostById, toggleLike } from "../../../lib/posts";
import { getComments, createComment, deleteComment } from "../../../lib/comments";
import { getMe } from "../../../lib/auth";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch post, comments, and user
  useEffect(() => {
    async function fetchData() {
      try {
        const [postData, commentData, userData] = await Promise.all([
          getPostById(id),
          getComments({ post: id }),
          getMe(),
        ]);
        setPost(postData);
        setComments(commentData.results || commentData);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching post or comments:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  // ✅ Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const data = await createComment({ post: id, content: newComment });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // ✅ Toggle like
  const handleToggleLike = async () => {
    try {
      const updated = await toggleLike(id);
      setPost((prev) => ({
        ...prev,
        likes_count: updated.likes_count,
        is_liked: updated.is_liked,
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading post...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative">
        {/* 🔙 Back to Feed (top) */}
        <div className="mb-4">
          <Link
            href="/feed"
            className="inline-block bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 hover:shadow transition"
          >
            ← Back to Feed
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{post.content}</p>

        {/* ❤️ Like button */}
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>✍️ {post.author?.username || "Unknown"}</span>
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1 ${
              post.is_liked ? "text-red-600" : "text-gray-500"
            } hover:underline`}
          >
            ❤️ {post.likes_count || 0}
          </button>
        </div>

        {/* 💬 Comments */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Comments ({comments.length})
          </h2>

          {/* List comments */}
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-32">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-start"
                >
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{c.author?.username || "Anon"}</span>:{" "}
                    {c.content}
                  </p>
                  {user && c.author?.id === user.id && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Footer with Comment + Back button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-3 rounded-t-lg shadow flex flex-col gap-2">
          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow p-2 border rounded bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:shadow transition"
            >
              Post
            </button>
          </form>

          {/* Back Button */}
          <Link
            href="/feed"
            className="inline-block text-center bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 hover:shadow transition"
          >
            ← Back to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
