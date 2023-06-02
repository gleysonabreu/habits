'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, SunDim } from '@phosphor-icons/react';

export function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all p-2 rounded-xl"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <SunDim size={23} /> : <Moon size={23} />}
    </button>
  );
}
