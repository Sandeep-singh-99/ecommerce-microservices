import React from "react";
import { ModeToggle } from "./mode-toggle";
import AuthComponent from "./AuthComponents";
import { useAppSelector } from "@/hooks/hooks";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-50/80 dark:bg-[#0000]/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="px-10 py-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Buyzaar</h1>

        <div className="flex items-center gap-4">
          {user ? (
            <img
              src={user.image}
              alt={user.user_name}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              loading="lazy"
            />
          ) : (
            <AuthComponent />
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
