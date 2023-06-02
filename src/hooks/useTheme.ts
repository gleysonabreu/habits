'use client';
import { ThemeProviderContext } from '@/contexts/ThemeProvider';
import { useContext } from 'react';

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }

  return context;
}
