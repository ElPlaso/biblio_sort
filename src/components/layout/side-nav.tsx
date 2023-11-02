import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/lib/store/store";
import SignOutButton from "../auth/sign-out";
import { usePathname } from "next/navigation";
import ProjectList from "../project-list";
import { MdLogin, MdChevronLeft } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SideNav({ isOpen, setIsOpen }: SideNavProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const pathName = usePathname();

  return (
    <nav
      className={`${
        isOpen ? "left-0" : "-translate-x-64"
      } fixed top-24 px-2 lg:w-64 md:w-44 h-screen overflow-x-visible rounded-md bg-white dark:bg-darkColor py-4 space-y-2 transition-transform  duration-300 ease-in-out`}
    >
      {user && (
        <h1 className="flex flex-row justify-between items-center text-2xl font-bold w-full text-gray-600 pl-2 mb-3 dark:text-white">
          Projects
          <button
            className={`p-2 hover:shadow-md rounded-lg text-gray-500 bg-white dark:text-gray-400 dark:bg-darkGray dark:hover:text-gray-300 transition-transform  duration-300 ease-in-out
        ${!isOpen && "lg:translate-x-14 md:translate-x-36"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <IoBookSharp size={24} />
          </button>
        </h1>
      )}

      {user && user.emailVerified ? (
        <div className="flex flex-col h-full pb-40">
          <ProjectList />
        </div>
      ) : pathName === "/login" ||
        pathName === "/register" ||
        pathName === "/reset-password" ? (
        <div className="pl-2">
          <Link href={"./"}>
            <div className="flex py-2 justify-between px-4 bg-blue-500 dark:hover:bg-blue-600 text-white font-bold hover:shadow-lg items-center">
              Go back
              <MdChevronLeft size={20} />
            </div>
          </Link>
        </div>
      ) : (
        <div className="pl-2">
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
