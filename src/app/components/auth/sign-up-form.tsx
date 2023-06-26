"use client";

import { SetStateAction, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../../../firebase";
import { AppDispatch, RootState } from "../../store/store";
import {
  signupStart,
  signupFailure,
  signupComplete,
} from "../../features/auth/auth-slice";
import { useDispatch } from "react-redux";
import GoogleSignIn from "./google-sign-in";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSelector } from "react-redux";
import Loader from "../loader/loader";

export const signUpUser =
  (email: string, password: string, username: string) =>
  (dispatch: AppDispatch) => {
    dispatch(signupStart());
    return new Promise<void>((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          updateProfile(result.user, {
            displayName: username,
          }).then(() => {
            sendEmailVerification(result.user);
            signOut(auth);
            dispatch(signupComplete());
            resolve();
          });
        })
        .catch((error) => {
          toast.error(error.code.split("/")[1].replaceAll("-", " "));
          dispatch(signupFailure(error.message));
          reject();
        });
    });
  };

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleUsernameChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setUsername(event.target.value);
  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setEmail(event.target.value);
  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setPassword(event.target.value);

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    signUpUser(
      email,
      password,
      username
    )(dispatch)
      .then(() => {
        setIsRegistered(true);
      })
      .catch(() => {
        setIsRegistered(false);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center font-lighter text-gray-400">
        <Loader />
        please wait a moment...
      </div>
    );
  }

  if (user) {
    return <></>;
  }

  if (isRegistered) {
    return (
      <div>
        <h1 className="text-4xl font-bold w-full">Verification email sent.</h1>
        <p>Please verify before signing in.</p>

        <Link
          href="/login"
          className="hover:underline text-blue-500 mt-10 w-full flex justify-center"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
      <h1 className="text-4xl font-bold w-full">Register.</h1>
      <input
        required
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
        className="px-4 py-2 border rounded-md dark:text-black dark:outline-none"
      />
      <input
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
        className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-md shadow-md"
      >
        Sign Up
      </button>

      <GoogleSignIn />
      <Link
        href="/login"
        className="hover:underline text-blue-500 mt-3 w-full flex justify-center"
      >
        Sign in with email & password
      </Link>
    </form>
  );
}
