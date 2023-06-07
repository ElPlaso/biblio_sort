import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: "light",
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state: { theme: string }) => state.theme;

export default themeSlice.reducer;