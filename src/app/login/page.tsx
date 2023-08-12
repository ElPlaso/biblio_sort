"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/auth/sign-in-form";

export default function LoginPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-2">
      <SignInForm />
    </div>
  );
}
