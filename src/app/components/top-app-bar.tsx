"use client";

import Image from "next/image";
import ThemeModeToggle from "./theme-mode-toggle";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function TopAppBar() {
  return (
    <header className="flex justify-between items-center w-full shadow-md absolute top-0 p-[25px] dark:bg-gray-900">
      <div className="flex items-center">
        <Image
          src="/favicon.ico"
          alt="BiblioSort Logo"
          width={50}
          height={50}
        />
        <h1 className="text-2xl font-bold ml-4">BiblioSort</h1>
      </div>
      <Provider store={store}>
        <ThemeModeToggle />
      </Provider>
    </header>
  );
}
