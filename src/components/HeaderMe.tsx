'use client';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
  back?: boolean;
  children: ReactNode;
};

export function HeaderMe({
  title,
  children,
  subtitle,
  back = false,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-5 text-center sm:text-left">
            {back && (
              <button onClick={() => router.back()}>
                <ArrowLeft
                  size={25}
                  className="text-gray-500 dark:text-gray-400"
                />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm text-gray-400 dark:text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
