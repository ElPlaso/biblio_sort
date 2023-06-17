// Import the functions you need from the SDKs you need
import { loginSuccess, logout, setAuthInitialized } from "@/app/features/auth/auth-slice";
import { store } from "@/app/store/store";
import AuthUser from "@/app/types/auth-user";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { loginStart } from '@/app/features/auth/auth-slice';

export const authStateObserver = () => {
  store.dispatch(loginStart());

  const auth = getAuth();

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: AuthUser = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        photoUrl: firebaseUser.photoURL || "",
        emailVerified: firebaseUser.emailVerified,
      };
      store.dispatch(loginSuccess(user));
    }
    else {
      store.dispatch(logout());
    }

    // Auth state has been determined
    store.dispatch(setAuthInitialized());
  });
}