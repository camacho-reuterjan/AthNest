import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/loading-animation";

interface ProfileFields {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  rating: number;
  section: string | string[];
  grade_level: string | null;
  strand: string | null;
  rank: string | null;
  bio: string | null;
  pfp_url: string;
  organizations: string[] | null;
  is_online: boolean;
  last_online: string;
  rating_history: JsonWebKey;
}

function ProfileInfo({ profile }: { profile: ProfileFields }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={profile.pfp_url}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-indigo-400 shadow-md"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {profile.full_name}
          </h2>
          <p className="text-indigo-500 text-sm">@{profile.username}</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Section:</strong> {profile.strand} {profile.grade_level} -{" "}
          {profile.section}
        </p>
        <p>
          <strong>Rating:</strong> {profile.rating} {profile.rank && "-"}{" "}
          {profile.rank}
        </p>
        <p>
          <strong>Organizations:</strong> {profile.organizations?.join(", ")}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={profile.is_online ? "text-green-500" : "text-red-400"}
          >
            {profile.is_online ? "Online" : "Offline"}
          </span>
        </p>
        <p className="italic">{profile.bio}</p>
      </div>
    </div>
  );
}

function RatingGraph() {
  return (
    <div className="bg-white mt-4 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating Graph</h3>
      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        Graph Placeholder
      </div>
    </div>
  );
}

function TopRatedSection() {
  return (
    <div className="bg-white mt-4 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Rated</h3>
      <ul className="text-sm text-gray-600 list-disc pl-5">
        <li>Ate Maria - 2100</li>
        <li>Kuya John - 2005</li>
        <li>Karl Marx - 2001</li>
      </ul>
    </div>
  );
}

function PreviousContests() {
  return (
    <div className="bg-white mt-4 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Previous Contests
      </h3>
      <ul className="text-sm text-gray-600 list-disc pl-5">
        <li>March Challenge - #12</li>
        <li>February Open - #6</li>
        <li>CodeFest Ateneo - #1</li>
      </ul>
    </div>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full mt-6 bg-indigo-500 text-white hover:bg-indigo-600 transition rounded-lg py-2 font-medium cursor-pointer"
    >
      Logout
    </button>
  );
}

function SettingsSection() {
  return (
    <div className="bg-secondary mt-4 p-6 rounded-xl shadow-xl text-textcolor">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <div className="space-y-2">
        <button className="w-full bg-accent hover:brightness-110 text-black rounded-md py-2 text-sm font-medium cursor-pointer">
          Change Profile Info
        </button>
        <button className="w-full bg-accent hover:brightness-110 text-black rounded-md py-2 text-sm font-medium cursor-pointer">
          Change Password
        </button>
        <button className="w-full bg-accent hover:brightness-110 text-black rounded-md py-2 text-sm font-medium cursor-pointer">
          Notification Settings
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileFields | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storage = localStorage.getItem("access_token")
      ? localStorage
      : sessionStorage;
    const id = storage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8000/profile/lookup/?username=${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) =>
        fetch(`http://localhost:8000/profile/id/${data.user_id}/`)
      )
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setTimeout(() => setLoading(false), 1000); // ✅ delay to avoid flash
      })
      .catch((err) => {
        console.error("Error fetching profile", err);
        setLoading(false);
      });
  }, [username]);

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl grid md:grid-cols-[7fr_3fr] gap-6">
        <div>
          {profile ? (
            <ProfileInfo profile={profile} />
          ) : (
            <p>Loading profile...</p>
          )}
          <RatingGraph />
        </div>
        <div>
          <SettingsSection />
          <TopRatedSection />
          <PreviousContests />
        </div>
      </div>
    </div>
  );
}
