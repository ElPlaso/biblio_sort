"use client";

import { SetStateAction, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../../firebase";
import GoogleSignIn from "./google-sign-in";
import { AppDispatch, RootState } from "@/app/store/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/app/features/auth/auth-slice";
import AuthUser from "@/app/types/auth-user";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Loader from "../loader/loader";

export const signInUser =
  (email: string, password: string, router: ReturnType<typeof useRouter>) =>
  async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // If email is not verified, sign the user out immediately
      if (!result.user.emailVerified) {
        await signOut(auth);
        toast.error("Please verify your email first");
        return;
      }

      const user: AuthUser = {
        uid: result.user.uid,
        displayName: result.user.displayName || "",
        email: result.user.email || "",
        emailVerified: result.user.emailVerified,
      };
      dispatch(loginSuccess(user));
      toast.success("Signed in");
      router.push("/");
    } catch (error: any) {
      toast.error(error.code.split("/")[1].replaceAll("-", " "));
      dispatch(loginFailure(error.message));
    }
  };

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch();

  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setEmail(event.target.value);
  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setPassword(event.target.value);

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signInUser(email, password, router)(dispatch);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader />
        Please wait a moment...
      </div>
    );
  }

  if (user) {
    return <></>;
  }

  return (
    <>
      <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
        <h1 className="text-4xl font-bold w-full">Login.</h1>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="px-4 py-2 border rounded-md dark:text-black dark:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="px-4 py-2 border rounded-md dark:text-black dark:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded w-full shadow-md"
        >
          Sign In
        </button>

        <GoogleSignIn />

        <Link
          href="/register"
          className="hover:underline text-blue-500 mt-3 w-full flex justify-center"
        >
          Register with email & password
        </Link>

        <Link
          href="/reset-password"
          className="text-blue-500 hover:underline w-full flex justify-center"
        >
          Forgot password?
        </Link>
      </form>
    </>
  );
}
