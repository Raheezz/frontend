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
      if (!id) return;
      try {
        const [postData, commentData, userData] = await Promise.all([
          getPostById(id),
          getComments({ post: id }),
          getMe(),
        ]);
        if (!postData?.id) throw new Error("Post not found");
        setPost(postData);
        setComments(commentData.results || commentData);
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleToggleLike = async () => {
    try {
      const updated = await toggleLike(id);
      setPost(prev => ({ ...prev, likes_count: updated.likes_count, is_liked: updated.is_liked }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="flex items-center justify-center min-h-screen" style={{ color: "var(--foreground)" }}>Loading post...</p>;
  if (error) return <p className="flex items-center justify-center min-h-screen text-red-600">{error}</p>;
  if (!post) return <p className="flex items-center justify-center min-h-screen" style={{ color: "var(--foreground)" }}>Post not found.</p>;

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="max-w-2xl mx-auto rounded-2xl shadow-md section-card p-6">
        <Link href="/main/feed" className="inline-block text-accent hover:underline text-sm" style={{ color: "var(--accent)" }}>← Back to Feed</Link>

        <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>{post.title}</h1>
        <p className="mb-6 leading-relaxed" style={{ color: "var(--foreground)" }}>{post.content}</p>

        <div className="flex justify-between items-center text-sm mb-6" style={{ color: "var(--foreground)" }}>
          <div className="flex items-center gap-2">
            {post.author?.avatar && <img src={post.author.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
            <span>✍️ {post.author?.username || "Unknown"}</span>
          </div>
          <button type="button" onClick={handleToggleLike} className={`flex items-center gap-1 font-medium hover:underline`} style={{ color: post.is_liked ? "#f87171" : "var(--foreground)" }}>
            ❤️ {post.likes_count || 0}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>Comments ({comments.length})</h2>
        {comments.length === 0 ? <p style={{ color: "var(--foreground)" }}>No comments yet.</p> : (
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="p-3 rounded-lg border section-card flex justify-between items-start">
                <p className="text-sm">
                  <span className="font-semibold">{c.author?.username || "Anon"}</span>: {c.content}
                </p>
                {user && c.author?.id === user.id && (
                  <button type="button" onClick={() => deleteComment(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); }} className="flex gap-2 mt-6">
          <input type="text" placeholder="Write a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-grow p-2 rounded-lg focus:outline-none" style={{ background: "var(--accent-light)", color: "var(--foreground)", borderColor: "var(--accent)" }} />
          <button type="submit" className="px-4 py-2 rounded-lg transition" style={{ background: "var(--accent)", color: "#fff" }}>Post</button>
        </form>
      </div>
    </div>
  );
}
