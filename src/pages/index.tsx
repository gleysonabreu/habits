import * as DialogContent from '@radix-ui/react-dialog';
import { signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowBendLeftUp,
  GithubLogo,
  MagnifyingGlass,
  TwitchLogo,
} from 'phosphor-react';
import { Button } from '../components/Button';
import { SearchUserDialog } from '../components/SearchUserDialog';

import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Languages } from '../components/Languages';
import { LoginError, SignInErrorTypes } from '../components/LoginError';
import logo from '../styles/images/logo.svg';

type HomeProps = {
  error: SignInErrorTypes;
};

export default function Home(props: HomeProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const { t: translate } = useTranslation('common');
  const { error: errorType } = props;

  return (
    <div className="min-h-full">
      <Head>
        <title>Home | Habit</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen bg-gray-950">
        <div className="flex-1 flex flex-col items-center w-full max-w-250 p-8">
          <div className="flex flex-1 justify-center items-center w-full pt-7 px-0 pb-12">
            <div className="flex w-full justify-between flex-col md:flex-row">
              <div className="flex flex-col self-start m-[0px_auto] lg:m-0 lg:self-center w-full max-w-120">
                <div className="flex mb-6">
                  <Image src={logo} alt="Habits Brand" width={172} />
                </div>
                <h1 className="text-gray-200 mb-6 text-5xl leading-tight">
                  {session
                    ? translate('title_logged_in')
                    : translate('title_not_logged_in')}
                </h1>
              </div>
              <div className="w-full max-w-120 gap-4 rounded pt-16 md:p-16 flex flex-col items-center justify-center m-[0px_auto] lg:m-0">
                {errorType && <LoginError errorType={errorType} />}
                {session ? (
                  <Button variant="black" size="lg" isFull asChild>
                    <Link href="/dashboard">
                      <ArrowBendLeftUp size={20} />
                      {translate('buttons.access_platform')}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="black"
                      size="lg"
                      isFull
                      onClick={() =>
                        signIn('github', {
                          callbackUrl: router.query.callbackUrl as string,
                        })
                      }
                    >
                      <GithubLogo size={24} />
                      {translate('buttons.login_with_github')}
                    </Button>
                    <Button
                      variant="purple"
                      size="lg"
                      isFull
                      onClick={() =>
                        signIn('twitch', {
                          callbackUrl: router.query.callbackUrl as string,
                        })
                      }
                    >
                      <TwitchLogo size={24} />
                      {translate('buttons.login_with_twitch')}
                    </Button>
                  </>
                )}
                <DialogContent.Root>
                  <Button variant="blue" size="md" asChild isFull>
                    <DialogContent.Trigger>
                      <MagnifyingGlass size={20} />
                      {translate('buttons.search_for_user')}
                    </DialogContent.Trigger>
                  </Button>

                  <SearchUserDialog />
                </DialogContent.Root>
                <Languages />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
    error: query.error || null,
  },
});
