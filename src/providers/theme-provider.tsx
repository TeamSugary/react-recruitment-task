import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = 'light' | 'dark';
type ThemeContextType = {
   theme: Theme;
   toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
type ThemeProviderProps = {
   children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
   const [theme, setTheme] = useState<Theme>('dark');

   useEffect(() => {
      // check local storage for saved theme
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
         setTheme(savedTheme);
      } else {
         // by default use system preference
         const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
         setTheme(systemDark ? 'dark' : 'light');
      }
   }, []);

   const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
   };

   // Apply theme to document element
   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
   }, [theme]);

   return (
      <ThemeContext value={{ theme, toggleTheme }}>
         {children}
      </ThemeContext>
   );
};

export const useTheme = (): ThemeContextType => {
   const context = useContext(ThemeContext);
   if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }
   return context;
};