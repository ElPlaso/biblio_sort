"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTheme, selectTheme } from "../features/theme/theme-slice";
import { useEffect } from "react";
import Switch from "./switch";

export default function ThemeModeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    if (newTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
      if (savedTheme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [dispatch]);

  return (
    <Switch
      label={theme === "light" ? "light" : "dark"}
      checked={theme === "dark"}
      id={"theme"}
      onChange={handleThemeChange}
    />
  );
}
