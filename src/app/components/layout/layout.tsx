"use client'";
import { fetchProjects } from "@/app/features/projects/project-slice";
import { useDispatch } from "react-redux";
import SideNav from "./side-nav";
import TopAppBar from "./top-app-bar";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { Toaster } from "react-hot-toast";
import { authStateObserver } from "@/app/services/auth-service";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    authStateObserver();
  }, []);

  const authInitialized = useSelector(
    (state: RootState) => state.auth.authInitialized
  );

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (authInitialized && user) {
      dispatch(fetchProjects(user.uid));
    }
  }, [authInitialized, user, dispatch]);

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
          <main className="flex-grow min-h-screen pt-24 pl-4 ml-64">{children}</main>
        </div>
        <TopAppBar />
      </div>
    </>
  );
}
