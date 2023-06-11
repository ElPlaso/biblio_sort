"use client";

import { SetStateAction, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../../../firebase";
import { AppDispatch } from "../../store/store";
import { signupStart, signupFailure } from "../../features/auth/auth-slice";
import { useDispatch } from "react-redux";
import GoogleSignIn from "./google-sign-in";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export const signUpUser =
  (
    email: string,
    password: string,
    username: string,
    router: ReturnType<typeof useRouter>
  ) =>
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
            resolve();
          });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            toast.error("Email already in use");
          } else if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
          } else {
            toast.error("Sign up failed");
          }
          dispatch(signupFailure(error.message));
          reject();
        });
    });
  };

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
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
      username,
      router
    )(dispatch)
      .then(() => {
        setIsRegistered(true);
      })
      .catch(() => {
        setIsRegistered(false);
      });
  };

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
        className="px-4 py-2 border rounded-md"
      />
      <input
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
