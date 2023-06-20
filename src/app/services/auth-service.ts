import { onAuthStateChanged } from "firebase/auth";
import { loginStart, loginSuccess, logout, setAuthInitialized } from "../features/auth/auth-slice";
import { store } from "../store/store";
import AuthUser from "../types/auth-user";
import { auth } from "../../../firebase";


export const authStateObserver = () => {
    store.dispatch(loginStart());

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