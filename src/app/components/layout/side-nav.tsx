import Link from "next/link";

export default function SideNav() {
  return (
    <nav className="fixed left-0 h-screen w-64 bg-gray-100 dark:bg-gray-900 px-2 pt-5 z-2 ">
      <Link href={"./login"}>
        <div className="flex py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded items-center justify-center">
          Sign in
        </div>
      </Link>
    </nav>
  );
}
