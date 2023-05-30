import { Logo } from '@/components/Logo';
import { SignIn, SignInErrorTypes } from '@/components/SignIn';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { HomeAvatars } from '@/components/HomeAvatars';
import { Suspense } from 'react';
import { HomeAvatarsLoading } from '@/components/HomeAvatarsLoading';

export const metadata = { title: 'Hábitos' };

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  const errorSigin = searchParams['error'] as SignInErrorTypes | undefined;

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="flex flex-col md:flex-row items-center flex-1 justify-center md:justify-between p-7 md:p-24 gap-10 md:gap-5">
        <div className="w-full flex items-center justify-center flex-col gap-2">
          <Link href="/" className="hover:opacity-80 scale-75 md:scale-100">
            <Logo />
          </Link>

          <Suspense fallback={<HomeAvatarsLoading />}>
            {/* @ts-expect-error async/await Server Component */}
            <HomeAvatars />
          </Suspense>
        </div>

        <SignIn error={errorSigin} />
      </div>

      <Footer />
    </main>
  );
}
