import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AuthUser from "../../types/auth-user";
import 'firebase/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signingUp: boolean;
  error: string | null;
  authInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  authInitialized: false,
  signingUp: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    signupStart: (state) => {
      state.loading = true;
      state.signingUp = true;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
      state.signingUp = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
    signupComplete: (state) => {
      state.loading = false;
      state.signingUp = false;
    },
    resetEmailSending: (state) => {
      state.loading = true;
    },
    resetEmailSent: (state) => {
      state.loading = false;
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, signupStart, signupFailure, logout, signupComplete, resetEmailSending, resetEmailSent, setAuthInitialized } = authSlice.actions;

export default authSlice.reducer;