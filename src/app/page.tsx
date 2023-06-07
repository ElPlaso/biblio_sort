"use client";

import ReferenceSorter from "./components/reference-sorter";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <ReferenceSorter />
    </Provider>
  );
}
