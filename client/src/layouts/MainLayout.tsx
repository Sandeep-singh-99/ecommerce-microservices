import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { useAuthCheck } from "@/api/authApi";
import { setUser } from "@/redux/slice/authSlice";

export function MainLayout() {
  const dispatch = useAppDispatch();
  const { data: user, isSuccess } = useAuthCheck();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [isSuccess, user, dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Navbar />
      <main className="flex-grow pt-[88px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
