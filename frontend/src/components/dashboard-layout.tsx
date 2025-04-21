// src/components/DashboardLayout.tsx
// import React from "react";
import { Outlet } from "react-router-dom";
import Ribbon from "./ribbon";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Ribbon />
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
