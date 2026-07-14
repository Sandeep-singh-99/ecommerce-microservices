import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div>
      <Toaster />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
