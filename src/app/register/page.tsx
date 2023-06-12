"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "../components/auth/sign-up-form";

export default function LoginPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const signingUp = useSelector((state: RootState) => state.auth.signingUp);
  const router = useRouter();

  useEffect(() => {
    if (user && !signingUp) {
      router.replace("/");
    }
  }, [user, router, signingUp]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <SignUpForm />
    </div>
  );
}
