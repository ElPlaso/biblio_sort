import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/lib/store/store";
import SignOutButton from "../auth/sign-out";
import { usePathname } from "next/navigation";
import ProjectList from "../project-list";
import { MdLogin, MdChevronLeft } from "react-icons/md";

export default function SideNav() {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathName = usePathname();
  return (
    <nav className="fixed left-0 h-screen lg:w-64 md:w-44 overflow-x-visible bg-white dark:bg-darkColor pt-28 pb-4  ">
      {user && user.emailVerified ? (
        <div className="flex flex-col h-full pb-16 space-y-4 transition-all">
          <div className="min-h-full">
            <ProjectList />
          </div>
          <div className="pl-4">
            <SignOutButton />
          </div>
        </div>
      ) : pathName === "/login" ||
        pathName === "/register" ||
        pathName === "/reset-password" ? (
        <div className="pl-4">
          <Link href={"./"}>
            <div className="flex py-2 justify-between px-4 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg items-center">
              Go back
              <MdChevronLeft size={20} />
            </div>
          </Link>
        </div>
      ) : (
        <div className="pl-4">
          <Link href={"./login"}>
            <div className="flex py-2 justify-between px-4 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg items-center">
              Sign in
              <MdLogin size={20} />
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
