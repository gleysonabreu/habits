'use client';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};

export default Provider;
