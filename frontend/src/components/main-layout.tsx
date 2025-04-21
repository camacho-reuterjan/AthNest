import Ribbon from "./ribbon";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Ribbon />
      <main className="flex-1 p-6 bg-gradient-to-br from-indigo-50 to-white">
        <Outlet />
      </main>
    </div>
  );
}
