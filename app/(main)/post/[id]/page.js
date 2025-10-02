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

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading post...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  if (!post)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <p>Post not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white border border-blue-100 rounded-2xl shadow-md p-6">
        {/* Back to Feed */}
        <div className="mb-4">
          <Link
            href="/feed"
            className="inline-block text-blue-600 hover:underline text-sm"
          >
            ← Back to Feed
          </Link>
        </div>

        {/* Title & Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">{post.content}</p>

        {/* Author + Avatar + Like */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            {post.author?.avatar && (
              <img
                src={post.author.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>✍️ {post.author?.username || "Unknown"}</span>
          </div>
          <button
            type="button" // ✅ Ensure it's a button
            onClick={handleToggleLike}
            className={`flex items-center gap-1 font-medium ${
              post.is_liked ? "text-red-600" : "text-gray-500"
            } hover:underline`}
          >
            ❤️ {post.likes_count || 0}
          </button>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between items-start border"
                >
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">
                      {c.author?.username || "Anon"}
                    </span>
                    : {c.content}
                  </p>
                  {user && c.author?.id === user.id && (
                    <button
                      type="button" // ✅ Ensure it's a button
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

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="flex gap-2 mt-6">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow p-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
