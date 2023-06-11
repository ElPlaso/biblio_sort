"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { AppDispatch } from "../../store/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/auth-slice";
import { auth } from "../../../../firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import AuthUser from "../../types/auth-user";
import { toast } from "react-hot-toast";

const provider = new GoogleAuthProvider();

export const loginWithGoogle =
  (router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL,
      };
      dispatch(loginSuccess(user as AuthUser));
      toast.success("Signed in");
      router.push("/");
    } catch (error) {
      const errorCode = (error as { code?: string }).code;
      const errorMessage = (error as { message?: string }).message;
      dispatch(loginFailure(errorMessage || `Unknown error ${errorCode}`));
    }
  };

export default function GoogleSignIn() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = () => {
    loginWithGoogle(router)(dispatch);
  };

  return (
    <button
      type="button"
      className=" flex bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded w-full items-center shadow-md"
      onClick={handleLogin}
    >
      <div className="bg-white rounded">
        <FcGoogle size={25} />
      </div>
      <h1 className="flex-grow ml-2">Sign in with Google</h1>
    </button>
  );
}
