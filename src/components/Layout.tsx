import { ReactNode } from 'react';
import { Header } from './Header';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col mx-auto items-center justify-center min-h-screen">
      <Header />
      <main className="flex w-full flex-1 max-w-[1000px]">{children}</main>
    </div>
  );
}
