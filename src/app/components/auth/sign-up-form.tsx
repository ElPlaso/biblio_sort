"use client";

import { SetStateAction, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../../firebase";
import { AppDispatch } from "../../store/store";
import AuthUser from "../../types/auth-user";
import {
  signupStart,
  signupFailure,
  loginSuccess,
} from "../../features/auth/auth-slice";
import { useDispatch } from "react-redux";
import GoogleSignIn from "./google-sign-in";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const signUpUser =
  (
    email: string,
    password: string,
    username: string,
    router: ReturnType<typeof useRouter>
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(signupStart());
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, {
        displayName: username,
      });
      const authUser: AuthUser = {
        uid: result.user.uid,
        displayName: result.user.displayName || "",
        email: result.user.email || "",
      };

      dispatch(loginSuccess(authUser));
      toast.success("Signed up");
      router.push("/");
    } catch (error: any) {
      if (error.code! === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (password.length < 6  ) {
        toast.error("Password must be at least 6 characters");
      } else {
        toast.error("Sign up failed");
      }
      dispatch(signupFailure(error.message));
    }
  };

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
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

    signUpUser(email, password, username, router)(dispatch);
  };

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
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
      >
        Sign Up
      </button>

      <GoogleSignIn />
    </form>
  );
}
