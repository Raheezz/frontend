"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../lib/posts";
import ProtectedRoute from "../../../components/ProtectedRoute";
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
    if (!user) return; // Safety check
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

      // Send post to backend
      const createdPost = await createPost(data);

      // Optional: if backend returns full post including author info, you can redirect to its detail page
      router.push(`/posts/${createdPost.id}`); 
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700 px-4 text-center">
        ⏳ Your account is pending admin approval. You can browse posts but not publish yet.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-blue-700">✍️ Create New Post</h1>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <textarea
          name="content"
          placeholder="Write your post..."
          value={form.content}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows="5"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-3 text-sm text-gray-600"
        />

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  );
}
