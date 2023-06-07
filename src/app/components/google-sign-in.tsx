"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { AppDispatch } from "../store/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/auth-slice";
import { auth } from "../../../firebase";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { store } from "../store/store";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const result = await signInWithPopup(auth, provider);
    dispatch(loginSuccess(result.user));
  } catch (error) {
    const errorCode = (error as { code?: string }).code;
    const errorMessage = (error as { message?: string }).message;
    dispatch(loginFailure(errorMessage || `Unknown error ${errorCode}`));
  }
};

export default function GoogleSignIn() {
  const dispatch = useDispatch();

  const handleLogin = () => {
    loginWithGoogle()(dispatch);
  };

  return (
    <Provider store={store}>
      <button onClick={handleLogin}>Login with Google</button>
    </Provider>
  );
}
