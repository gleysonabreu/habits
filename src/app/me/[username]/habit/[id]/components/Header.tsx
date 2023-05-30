'use client';
import { Button } from '@/components/Button';
import { ArrowLeft, Check, ShareFat } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const [isCopied, setIsCopied] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  function handleCopyUrl() {
    const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
  }

  useEffect(() => {
    const timerClearCheckCopy = setTimeout(() => setIsCopied(false), 5000);

    return () => clearTimeout(timerClearCheckCopy);
  }, [isCopied]);

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-5 text-center sm:text-left">
            <button onClick={() => router.back()}>
              <ArrowLeft
                size={25}
                className="text-gray-500 dark:text-gray-400"
              />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {title}
            </h1>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <Button
              title="Nova tarefa"
              size="lg"
              variant="brand"
              type="button"
              onClick={handleCopyUrl}
            >
              <span className="block">Compartilhar</span>
              {isCopied ? (
                <Check
                  size={16}
                  className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5"
                />
              ) : (
                <ShareFat
                  size={16}
                  className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5"
                />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
