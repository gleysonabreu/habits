'use client';
import { ReactNode, createContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeProviderContextValues = {
  theme: Theme;
  toggleTheme: () => void;
};

type ThemeProviderContextProps = {
  children: ReactNode;
};

export const ThemeProviderContext =
  createContext<ThemeProviderContextValues | null>(null);

export function ThemeProvider({ children }: ThemeProviderContextProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return storedTheme ? (JSON.parse(storedTheme) as Theme) : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
