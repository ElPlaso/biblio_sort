"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import Layout from "./layout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
}
