"use client";

import { useEffect, useState } from "react";
import { getMe, updateMe } from "../../lib/auth";  // ✅ fixed import

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success, error, warning

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getMe();
        setUser(data);
        setBio(data.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("⚠️ You must be logged in to view your profile.");
        setMessageType("warning");
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const updated = await updateMe(formData);
      setUser(updated);
      setMessage("✅ Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile. Try again.");
      setMessageType("error");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          My Profile
        </h1>

        {/* User info */}
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-4">
          <img
            src={avatar ? URL.createObjectURL(avatar) : user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        {/* Status message */}
        {message && (
          <p
            className={`mb-4 text-center text-sm ${
              messageType === "success"
                ? "text-green-500"
                : messageType === "error"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your bio..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
