"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute wrapper
 * - If `requireAuth` = true → only logged-in users allowed (redirect to /login otherwise)
 * - If `requireAuth` = false → works for public pages (shows children even if guest)
 */
export default function ProtectedRoute({ children, requireAuth = true }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push("/login"); // redirect only if auth required
    }
  }, [user, loading, router, requireAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  // If auth required and user missing → don't flash page
  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
