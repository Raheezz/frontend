"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../lib/posts";
import { getMe } from "../../../lib/auth";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setChecking(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPost(form);
      router.push("/feed"); // redirect back to feed
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Checking permissions...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        ⚠️ You must be logged in to create a post.
      </div>
    );
  }

  if (!user.is_verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        ⏳ Your account is pending admin approval. You can browse posts but not publish yet.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          ✍️ Create New Post
        </h1>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
        <textarea
          name="content"
          placeholder="Write your post..."
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          rows="5"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
