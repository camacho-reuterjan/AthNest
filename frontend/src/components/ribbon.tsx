import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingAnimation from "./loading-animation";
export default function Ribbon() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfileRedirect, setLoadingProfileRedirect] = useState(false);
  const navigate = useNavigate();

  // Get userId from storage
  useEffect(() => {
    const storage = localStorage.getItem("access_token")
      ? localStorage
      : sessionStorage;
    const id = storage.getItem("user_id");
    setUserId(id);
  }, []);

  // Fetch username with delay to avoid flash
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8000/profile/id/${userId}/`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((data) => {
          setUsername(data.username);
          // Delay for 1s after fetching data before hiding loader
          setTimeout(() => setLoading(false), 20);
        })
        .catch((err) => {
          console.error("Error fetching username from userId", err);
          setLoading(false); // Still hide loading even if error
        });
    }
  }, [userId]);

  // Handle profile click
  async function handleProfileClick() {
    setLoadingProfileRedirect(true);
    try {
      const storage = localStorage.getItem("access_token")
        ? localStorage
        : sessionStorage;
      const userId = storage.getItem("user_id");

      if (!userId) throw new Error("No user ID found");

      const res = await fetch(`http://localhost:8000/profile/id/${userId}/`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      navigate(`/${data.username}`);
    } catch (err) {
      console.error("Failed to redirect to profile:", err);
    } finally {
      setLoadingProfileRedirect(false);
    }
  }

  // Loading overlay (full screen)
  if (loading || loadingProfileRedirect) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <Link to="/homepage" className="text-xl font-bold text-indigo-600">
        AthNest
      </Link>
      <div className="space-x-6 text-sm font-medium text-gray-700">
        <Link to="/education" className="hover:text-indigo-500">
          📘 Education
        </Link>
        <Link to="/competition" className="hover:text-indigo-500">
          🏁 Competition
        </Link>
        <Link to="/leaderboard" className="hover:text-indigo-500">
          🏆 Leaderboard
        </Link>
        <Link
          to="#"
          className="hover:text-indigo-500"
          onClick={(e) => {
            e.preventDefault();
            handleProfileClick();
          }}
        >
          👤 Profile
        </Link>
      </div>
    </nav>
  );
}
