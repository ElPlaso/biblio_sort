"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { AppDispatch } from "../store/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/auth-slice";
import { auth } from "../../../firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const result = await signInWithPopup(auth, provider);
    dispatch(loginSuccess(result.user));
    useRouter().push("/");
  } catch (error) {
    const errorCode = (error as { code?: string }).code;
    const errorMessage = (error as { message?: string }).message;
    dispatch(loginFailure(errorMessage || `Unknown error ${errorCode}`));
  }
};

export default function GoogleSignIn() {
  const dispatch = useDispatch();

  const handleLogin = () => {
    loginWithGoogle()(dispatch);
  };

  return (
    <button
      className=" flex bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 font-bold rounded w-[250px] items-center shadow-md"
      onClick={handleLogin}
    >
      <div className="bg-white rounded p-2">

      <FcGoogle size={25} />
      </div>
      <h1 className="flex-grow my-2 ml-2">Sign in with Google</h1>
    </button>
  );
}
