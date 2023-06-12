import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store/store";
import SignOutButton from "../auth/sign-out";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const user = useSelector((state: RootState) => state.auth.user);
  const signingUp = useSelector((state: RootState) => state.auth.signingUp);
  const pathName = usePathname();
  return (
    <nav className="fixed left-0 h-screen w-64 bg-white dark:bg-darkColor shadow-xl px-2 z-2 pt-5 z-2 color-transition-applied">
      <div className="pt-24">
        {user && !signingUp ? (
          <SignOutButton />
        ) : pathName === "/login" ||
          pathName === "/register" ||
          pathName === "/reset-password" ? (
          <Link href={"./"}>
            <div className="flex py-2 px-4 bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-blue-600 text-white font-bold rounded items-center justify-center">
              Home
            </div>
          </Link>
        ) : (
          <Link href={"./login"}>
            <div className="flex py-2 px-4 bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-blue-600 text-white font-bold rounded items-center justify-center">
              Sign in
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
