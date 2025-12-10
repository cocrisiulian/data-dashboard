"use client";
import { createContext, useContext, useEffect, useState } from "react";

type BackgroundTheme = "dark" | "light" | "gradient";

const BackgroundThemeContext = createContext<{
  bgTheme: BackgroundTheme;
  setBgTheme: (t: BackgroundTheme) => void;
} | undefined>(undefined);

export function useBackgroundTheme() {
  const ctx = useContext(BackgroundThemeContext);
  if (!ctx) throw new Error("useBackgroundTheme must be used within BackgroundThemeProvider");
  return ctx;
}

export function BackgroundThemeProvider({ children }: { children: React.ReactNode }) {
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>("dark");

  useEffect(() => {
    // Load saved theme from localStorage
    const saved = localStorage.getItem("bgTheme") as BackgroundTheme;
    if (saved && ["dark", "light", "gradient"].includes(saved)) {
      setBgTheme(saved);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("bgTheme", bgTheme);
    
    // Apply background class to body
    document.body.classList.remove("bg-dark", "bg-light", "bg-gradient");
    document.body.classList.add(`bg-${bgTheme}`);
  }, [bgTheme]);

  return (
    <BackgroundThemeContext.Provider value={{ bgTheme, setBgTheme }}>
      {children}
    </BackgroundThemeContext.Provider>
  );
}
