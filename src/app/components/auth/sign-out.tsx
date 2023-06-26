"use strict";
import { signOut } from "firebase/auth";
import { logout } from "../../features/auth/auth-slice";
import { auth } from "../../../../firebase";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdOutlineDirectionsRun } from "react-icons/md";

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
      className="flex py-2 px-4 text-white bg-green-500 dark:hover:text-green-400 dark:bg-gray-100 dark:bg-opacity-10 dark:text-gray-400 hover:shadow-lg  justify-between font-bold items-center w-full"
    >
      Sign out
      <MdOutlineDirectionsRun size={20} />
    </button>
  );
}
