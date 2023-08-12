"use client";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ThemeModeToggle from "../theme-mode-toggle";

export default function TopAppBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userFirstLetter = user?.displayName?.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center w-full fixed top-0 p-[25px] shadow-sm dark:shadow-2xl dark:bg-darkColor bg-white h-24  ">
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          src="/favicon.ico"
          alt="BiblioSort Logo"
          width={50}
          height={50}
        />
        <h1 className="text-3xl font-bold ml-4 text-gray-600 dark:text-white dark:hover:text-gray-200">
          BiblioSort
        </h1>
      </Link>
      <div className="flex items-center">
        <ThemeModeToggle />
        {user && user.emailVerified ? (
          user.photoUrl ? (
            <Image
              className="ml-4 rounded-full cursor-pointer"
              src={user.photoUrl}
              alt="User profile"
              title={`Logged in as ${user.displayName}`}
              width={50}
              height={50}
            />
          ) : (
            <div
              className="ml-4 bg-blue-500 dark:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl cursor-pointer"
              title={`Logged in as ${user.displayName}`}
            >
              {userFirstLetter}
            </div>
          )
        ) : null}
      </div>
    </header>
  );
}
