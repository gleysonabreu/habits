import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { Layout } from '../../components/Layout';
import { api } from '../../libs/axios';
import { authOptions } from '../api/auth/[...nextauth]';

type AccountInputs = {
  username: string;
};

export default function Account() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const { t: translate } = useTranslation('common');

  const schema = z.object({
    username: z.string().min(3),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AccountInputs>({
    resolver: zodResolver(schema),
  });

  const handleUpdateUsername: SubmitHandler<AccountInputs> = async data => {
    const toastId = toast.loading(translate('messages.loading'));
    try {
      setLoading(true);
      await api.patch('/users/update/username', {
        username: data.username,
      });
      toast.update(toastId, {
        render: translate('messages.username_updated'),
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      session!.user.username = data.username;
      reset();
      setLoading(false);
    } catch (error: any) {
      if (error.response.data.errors) {
        toast.dismiss(toastId);
        error.response.data.errors.forEach((error: any) => {
          setError(error.path[0], {});
        });
      } else if (error.response.data.message) {
        toast.update(toastId, {
          render: error.response.data.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      } else {
        toast.update(toastId, {
          render: translate('messages.something_went_wrong'),
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
      setLoading(false);
    }
  };

  const PAGE_TITLE = `${translate('header_dashboard.menu.account')} | Habit`;

  return (
    <Layout>
      <Head>
        <title>{PAGE_TITLE}</title>
      </Head>
      <div className="flex flex-1 justify-center items-center p-2 sm:p-6 lg:p-0">
        <div className="w-full min-h-64 max-w-2xl bg-zinc-900 py-4 px-10 text-white rounded-lg shadow-lg shadow-black/25">
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit(handleUpdateUsername)}
          >
            <fieldset className="flex flex-col gap-5 mb-3">
              <label className="text-sm text-gray-200 text-left">
                {translate('account.username.title')}
              </label>
              <input
                {...register('username', { required: true })}
                placeholder={
                  translate('account.username.placeholder_input') as string
                }
                className={classNames(
                  'focus:outline-none focus:ring-2 ring-opacity-40 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6',
                  {
                    'ring-gray-950': !errors.username,
                    'ring-red-500': errors.username,
                  },
                )}
              />
              {errors.username && (
                <span className="text-red-500">
                  {translate('messages.fill_username')}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-5 mb-3">
              <Button
                size="md"
                variant="green"
                disabled={loading}
                type="submit"
              >
                <Check size={24} />
                {translate('account.username.button')}
              </Button>
            </fieldset>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { locale, req, res } = context;
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
    },
  };
};
