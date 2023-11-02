"use client";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ThemeModeToggle from "../theme-mode-toggle";
import MoreButtonDropdown from "../more-button-dropdown";
import { MdOutlineDirectionsRun } from "react-icons/md";
import { signOut } from "firebase/auth";
import { logout } from "@/lib/features/auth/auth-slice";
import { auth } from "../../../firebase";
import { AppDispatch } from "@/lib/store/store";
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

export default function TopAppBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const userFirstLetter = user?.displayName?.charAt(0).toUpperCase();

  const handleLogout = () => {
    logoutFromFirebase(router)(dispatch);
  };

  return (
    <header className="flex justify-between items-center w-full fixed top-0 p-[25px] shadow-sm dark:shadow-2xl dark:bg-darkColor bg-white h-24  ">
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          src="/favicon.ico"
          alt="BiblioSort Logo"
          width={50}
          height={50}
        />
        <h1 className="text-3xl font-bold ml-4 text-gray-600 dark:text-white dark:hover:text-gray-200">
          BiblioSort
        </h1>
      </Link>
      <div className="flex items-center justify-center">
        <ThemeModeToggle />
        {user && user.emailVerified ? (
          user.photoUrl ? (
            <Image
              className="ml-4 rounded-full cursor-pointer hover:border hover:shadow-lg"
              src={user.photoUrl}
              alt="User profile"
              title={`Logged in as ${user.displayName}`}
              width={50}
              height={50}
            />
          ) : (
            <div
              className="ml-4 bg-blue-500 dark:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl cursor-pointer"
              title={`Logged in as ${user.displayName}`}
            >
              {userFirstLetter}
            </div>
          )
        ) : null}
        <MoreButtonDropdown
          horizontal
          position="left"
          items={[
            {
              id: "sign Out",
              label: "Sign Out",
              onClick: (e) => {
                e.preventDefault();
                handleLogout();
              },
              icon: <MdOutlineDirectionsRun size={20} />,
            },
          ]}
        />
      </div>
    </header>
  );
}
