"use client";

import { SetStateAction, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setEmail(event.target.value);

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((error: any) => {
        if (error.code === "auth/user-not-found") {
          toast.error("No user found with this email");
        } else {
          toast.error("Failed to send password reset email");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {emailSent ? (
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold w-full mb-1">
            Password Reset Email sent.
          </h1>
          <h2 className="font-bold">Don&apos;t see any email?</h2>
          <p>
            Please check your spam folder or...
          </p>
          <button
            className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-md shadow-md self-center mt-5 w-full"
            onClick={handleFormSubmit}
          >
            Resend Email
          </button>
          <Link
            href="/login"
            className="hover:underline text-blue-500 mt-3  flex justify-center"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form className="flex flex-col space-y-4" onSubmit={handleFormSubmit}>
          <h1 className="text-4xl font-bold w-full">Reset Password.</h1>
          <input
            required
            className="px-4 py-2 border rounded-md"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
          >
            Send Password Reset Email
          </button>
          <Link
            href="/login"
            className="hover:underline text-blue-500 mt-3 w-full flex justify-center"
          >
            Back to login
          </Link>
        </form>
      )}
    </div>
  );
}
