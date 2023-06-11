"use client";

import GoogleSignIn from "../components/auth/google-sign-in";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "../components/auth/sign-in-form";
import Link from "next/link";

export default function LoginPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <SignInForm />

      <Link href="/register" className="underline text-blue-500 mt-3">
        Register with email & password
      </Link>
    </div>
  );
}
