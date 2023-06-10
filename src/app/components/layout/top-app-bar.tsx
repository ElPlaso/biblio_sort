"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeModeToggle from "../theme-mode-toggle";

export default function TopAppBar() {
  return (
    <header className="flex justify-between items-center w-full shadow-md absolute top-0 p-[25px] dark:bg-gray-900 bg-white h-24">
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          src="/favicon.ico"
          alt="BiblioSort Logo"
          width={50}
          height={50}
        />
        <h1 className="text-3xl font-bold ml-4 text-gray-600 dark:text-white dark:hover:text-gray-200">BiblioSort</h1>
      </Link>
      <ThemeModeToggle />
    </header>
  );
}
