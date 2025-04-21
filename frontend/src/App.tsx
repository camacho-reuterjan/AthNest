import { Suspense } from "react";

import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/main-layout";
import Homepage from "./pages/Dashboard/Homepage";
import ProfilePage from "./pages/Profile/Profile";
import LoadingAnimation from "./components/loading-animation";

import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-base">
          <LoadingAnimation />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/education" element={<div>Education</div>} />
          <Route path="/leaderboard" element={<div>Leaderboard</div>} />
          <Route path="/competition" element={<div>Competition</div>} />
          <Route path="/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
