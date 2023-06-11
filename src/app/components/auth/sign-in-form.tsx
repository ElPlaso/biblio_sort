"use client";

import { SetStateAction, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase";
import GoogleSignIn from "./google-sign-in";
import { AppDispatch } from "@/app/store/store";
import {
  signupStart,
  loginSuccess,
  signupFailure,
} from "@/app/features/auth/auth-slice";
import AuthUser from "@/app/types/auth-user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

export const signInUser =
  (email: string, password: string, router: ReturnType<typeof useRouter>) =>
  async (dispatch: AppDispatch) => {
    dispatch(signupStart());
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const user: AuthUser = {
        uid: result.user.uid,
        displayName: result.user.displayName || "",
        email: result.user.email || "",
      };
      dispatch(loginSuccess(user));
      toast.success("Signed in");
      router.push("/");
    } catch (error: any) {
      if (
        error.code! === "auth/user-not-found" ||
        error.code! === "auth/wrong-password"
      ) {
        toast.error("Incorrect email or password");
      } else {
        toast.error("Sign in failed");
      }

      dispatch(signupFailure(error.message));
    }
  };

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
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

  return (
    <>
      <form
        className="flex flex-col space-y-4 items-center"
        onSubmit={handleFormSubmit}
      >
        <h1 className="text-4xl font-bold w-full">Login.</h1>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="px-4 py-2 border rounded-md"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded w-full shadow-md"
        >
          Sign In
        </button>

        <GoogleSignIn />
      </form>
    </>
  );
}
