"use strict";
import { signOut } from "firebase/auth";
import { logout } from "../../features/auth/auth-slice";
import { auth } from "../../../../firebase";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

export const logoutFromFirebase = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error) {
    console.log(error);
  }
};

export default function SignOutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutFromFirebase()(dispatch);
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
