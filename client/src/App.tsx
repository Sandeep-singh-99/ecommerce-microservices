import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { useAppDispatch } from "./hooks/hooks";
import { useAuthCheck } from "./api/authApi";
import { setUser } from "./redux/slice/authSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { data: user, isSuccess } = useAuthCheck();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [isSuccess, user, dispatch]);
  return (
    <div>
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  );
}
