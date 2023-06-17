"use client";

import SideNav from "./side-nav";
import TopAppBar from "./top-app-bar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Toaster } from "react-hot-toast";
import { authStateObserver } from "@/app/services/auth-service";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    authStateObserver();
  }, []);
  const authInitialized = useSelector(
    (state: RootState) => state.auth.authInitialized
  );

  if (!authInitialized) {
    return <></>;
  }

  return (
    <>
      <Toaster
        toastOptions={{ className: "dark:bg-darkColor dark:text-white" }}
      />
      <div className="flex h-screen">
        <div className="flex flex-row flex-grow w-full">
          <SideNav />
          <main className="flex-grow min-h-screen p-24 ml-64">{children}</main>
        </div>
        <TopAppBar />
      </div>
    </>
  );
}
