
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "default" | "purple" | "blue" | "green" | "orange" | "red";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light";
  });
  
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme;
    return savedColorTheme || "blue"; // Changed default to blue
  });

  // Apply theme class to document
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Apply color theme class to document
  useEffect(() => {
    localStorage.setItem("colorTheme", colorTheme);
    
    // Remove all color theme classes first
    document.documentElement.classList.remove(
      "theme-default", "theme-purple", "theme-blue", 
      "theme-green", "theme-orange", "theme-red"
    );
    
    // Add the current color theme class
    document.documentElement.classList.add(`theme-${colorTheme}`);
    
    // Force a refresh of all themed components
    document.body.style.transition = 'background-color 0.2s ease';
    document.body.style.backgroundColor = getComputedStyle(document.documentElement).backgroundColor;
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
