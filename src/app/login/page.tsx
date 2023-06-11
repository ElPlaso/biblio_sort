"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "../components/auth/sign-in-form";
import Link from "next/link";
import Loader from "../components/loader/loader";

export default function LoginPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (user || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader />
        Please wait a moment...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-2">
      <SignInForm />

      <Link href="/reset-password" className="text-blue-500 hover:underline">
        Forgot password?
      </Link>
    </div>
  );
}
