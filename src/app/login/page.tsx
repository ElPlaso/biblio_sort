"use client";

import GoogleSignIn from "../components/google-sign-in";
import { useSelector } from 'react-redux';
import { RootState } from "../store/store"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <GoogleSignIn />
    </div>
  );
}
