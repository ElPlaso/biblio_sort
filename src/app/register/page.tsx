"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "../components/auth/sign-up-form";
import Link from "next/link";
import GoogleSignIn from "../components/auth/google-sign-in";

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
      <SignUpForm />
      <Link href="/login" className="underline text-blue-500 mt-3">
        Sign in with email & password
      </Link>
    </div>
  );
}
