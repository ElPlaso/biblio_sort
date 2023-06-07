"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import GoogleSignIn from "../components/google-sign-in";

export default function LoginPage() {
  return (
    <Provider store={store}>
      <GoogleSignIn />
    </Provider>
  );
}
