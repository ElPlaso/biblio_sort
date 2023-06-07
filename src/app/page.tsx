"use client";

import ReferenceSorter from "./components/reference-sorter";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 w-full">
      <Provider store={store}>
        <ReferenceSorter />
      </Provider>
    </main>
  );
}
