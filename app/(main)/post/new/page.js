"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../lib/posts";
import ProtectedRoute from "../../../components/ProtectedRoute"; // 👈 use wrapper
import { useAuth } from "@/context/AuthContext";

function NewPostContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (image) {
        data = new FormData();
        data.append("title", form.title);
        data.append("content", form.content);
        data.append("image", image);
      } else {
        data = { ...form };
      }

      await createPost(data);
      router.push("/feed");
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extra guard: only verified users can post
  if (!user?.is_verified) {
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

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-3 text-sm text-gray-700 dark:text-gray-300"
        />

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-lg border"
            />
          </div>
        )}

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

// ✅ Wrap in ProtectedRoute
export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  );
}
