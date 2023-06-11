"use client";

import SideNav from "./side-nav";
import TopAppBar from "./top-app-bar";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster />
      <div className="flex h-screen">
        <div className="flex flex-row flex-grow w-full">
          <div className="pt-24">
            <SideNav />
          </div>
          <main className="flex-grow min-h-screen p-24 ml-64">{children}</main>
        </div>
        <TopAppBar />
      </div>
    </Provider>
  );
}
