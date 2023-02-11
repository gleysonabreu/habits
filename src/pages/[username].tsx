import { Habit, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { DisclosureItem } from '../components/DisclosureItem';
import { Languages } from '../components/Languages';
import { Logo } from '../components/Logo';
import { api } from '../libs/axios';

type ProfileProps = {
  user: User & {
    Habit: Habit[];
  };
};

export default function Profile({ user }: ProfileProps) {
  const title = `Habits | ${user.name}`;

  const { t: translate } = useTranslation();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Head>
        <title>{title}</title>
      </Head>
      <header className="w-full min-h-20 lg:h-20 bg-gray-900 shadow-header flex items-center justify-between p-3 transition-all relative">
        <Link href="/" className="h-9 flex items-center">
          <Logo />
        </Link>

        <div className="flex gap-4 flex-col md:flex-row items-center justify-center">
          <Languages />
          <div className="flex gap-2 items-center bg-brand-blue-low border border-brand-blue-dark h-11 rounded-full p-3">
            <Image
              alt={user.name as string}
              src={user.image || '/avatar.svg'}
              width={32}
              height={32}
              className="rounded-full"
            />
            <h1>{user.name}</h1>
          </div>
        </div>
      </header>
      <main className="flex w-full flex-col p-5 items-center justify-center">
        <div className="text-center items-center justify-center flex gap-2 w-full max-w-250 pt-6">
          <h1 className="text-2xl md:text-4xl font-bold truncate">
            {translate('profile.title')}
          </h1>
          <span className="text- md:text-base text-gray-100 shrink-0 bg-brand-blue-mid pr-2.5 pl-2.5 pb-0.5 pt-0.5 rounded-full inline-flex justify-center items-center ">
            <p className="whitespace-nowrap">{user.Habit.length}</p>
          </span>
        </div>
        <div className="w-full h-full flex p-6 flex-col">
          <div className="mx-auto w-full max-w-250 p-2">
            {user.Habit.map(habit => (
              <DisclosureItem key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  ProfileProps
> = async context => {
  const username = context.query.username as string;
  try {
    const res = await api.get(`/users/${username}`);
    return {
      props: {
        ...(await serverSideTranslations(context.locale ?? 'en-US', [
          'common',
        ])),
        user: res.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
