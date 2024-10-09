"use client";
import { useEffect } from "react";
import { useTheme } from './context/ThemeContext';

export const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

  // Update the HTML body class based on the current theme
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'light' : '';
  }, [theme]);

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
};

