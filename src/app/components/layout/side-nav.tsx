import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store/store";
import SignOutButton from "../auth/sign-out";
import { usePathname } from "next/navigation";
import ProjectList from "../project-list";

export default function SideNav() {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathName = usePathname();
  return (
    <nav className="fixed left-0 h-screen w-64 bg-white dark:bg-darkColor z-2 pt-28 pb-4 z-2 color-transition-applied">
      {user && user.emailVerified ? (
        <div className="flex flex-col h-full pb-16 space-y-4 transition-all">
          <div className="min-h-full">
            <ProjectList />
          </div>
          <div className="pl-4"><SignOutButton /></div>
        </div>
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
    </nav>
  );
}
