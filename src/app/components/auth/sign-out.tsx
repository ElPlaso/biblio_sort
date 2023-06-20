"use strict";
import { signOut } from "firebase/auth";
import { logout } from "../../features/auth/auth-slice";
import { auth } from "../../../../firebase";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const logoutFromFirebase =
  (router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
    try {
      await signOut(auth);
      toast.success("Signed out");
      router.push("/login");
      dispatch(logout());
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

export default function SignOutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    logoutFromFirebase(router)(dispatch);
  };

  return (
    <button
      onClick={handleLogout}
      className="flex py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded items-center justify-center w-full"
    >
      Sign out
    </button>
  );
}
