'use client';
import '../styles/globals.css';
import '../libs/dayjs';
import { Inter } from 'next/font/google';
import Provider from '@/components/Provider';
import { SWRConfig } from 'swr/_internal';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function SWRFetcher(
    resource: RequestInfo | URL,
    init: RequestInit | undefined,
  ) {
    const response = await fetch(resource, init);
    const responseBody = await response.json();

    return responseBody;
  }

  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </head>
      <body
        className={`${inter.className} text-zinc-800 dark:text-zinc-100 bg-white dark:bg-[#121212]`}
      >
        <SWRConfig value={{ fetcher: SWRFetcher }}>
          <Provider>{children}</Provider>
        </SWRConfig>
      </body>
    </html>
  );
}
