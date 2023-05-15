import { Logo } from '@/components/Logo';
import { SignIn, SignInErrorTypes } from '@/components/SignIn';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link'
import { redirect } from 'next/navigation';

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
    <main className="flex min-h-screen flex-col items-center justify-center md:flex-row md:justify-between p-7 md:p-24 gap-20 md:gap-5">
      <div className='w-full flex items-center justify-center'>
        <Link href='/' className='hover:opacity-80 scale-75 md:scale-100'>
          <Logo />
        </Link>
      </div>

      <SignIn error={errorSigin} />
    </main>
  )
}
