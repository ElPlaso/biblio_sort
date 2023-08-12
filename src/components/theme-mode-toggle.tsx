"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTheme, selectTheme } from "@/lib/features/theme/theme-slice";
import { useEffect } from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

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
    <button
      onClick={handleThemeChange}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      className="transition-colors duration-200"
    >
      {theme === "light" ? (
        <IoSunnyOutline size={25} />
      ) : (
        <IoMoonOutline size={25} />
      )}
    </button>
  );
}
