import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../../components/Button';
import { Layout } from '../../components/Layout';
import { ScrollArea } from '../../components/ScrollArea';
import { useHabits } from '../../hooks/useHabits';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Dashboard() {
  const { habits, totalHabits } = useHabits();

  const { t: translate } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>Dashboard | Habit</title>
      </Head>

      <div className="flex flex-1 justify-center items-center">
        <div className="flex mx-auto max-h-[500px] max-w-4xl w-full">
          <div className="w-full h-full flex p-2 sm:p-6 lg:p-0">
            {habits.length === 0 ? (
              <div className="flex w-2/4 p-6 gap-4 mx-auto rounded-lg items-center justify-center bg-zinc-900">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 20 20"
                  fill="none"
                  fillRule="evenodd"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-center"
                >
                  <path d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"></path>
                </svg>
                <h1>{translate('dashboard_box.no_habits')}</h1>
              </div>
            ) : (
              <div className="flex-1 flex-col h-full flex w-full max-w-250 p-8 pb-2 bg-zinc-900 mx-auto rounded-xl shadow">
                <div className="flex w-full items-center justify-start mt-0 gap-2">
                  <p className="text-gray-100 font-medium text-xl shrink-0">
                    {translate('table_habits.title')}
                  </p>
                  <span className="text-gray-100 shrink-0 bg-brand-blue-mid text-sm pr-2.5 pl-2.5 pb-0.5 pt-0.5 rounded-full inline-flex justify-center items-center ">
                    <p className="whitespace-nowrap">{totalHabits}</p>
                  </span>
                </div>
                <p className="text-gray-300 font-normal text-base text-left shrink-0 mt-2">
                  {translate('table_habits.subtitle')}
                </p>

                <ScrollArea>
                  <table className="text-gray-300 tabular-nums font-normal text-base w-full">
                    <thead className="text-gray-100 font-semibold text-left">
                      <tr>
                        <th className="font-semibold text-left pr-4 pl-4 pt-3.5 whitespace-nowrap">
                          {translate('table_habits.t_head.item1')}
                        </th>
                        <th className="font-semibold text-left pr-4 pl-4 pt-3.5 whitespace-nowrap">
                          {translate('table_habits.t_head.item2')}
                        </th>
                        <th className="font-semibold text-left pr-4 pl-4 pt-3.5 whitespace-nowrap hidden lg:table-cell">
                          {translate('table_habits.t_head.item3')}
                        </th>
                        <th className="font-semibold text-left pr-4 pl-4 pt-3.5 whitespace-nowrap hidden sm:table-cell">
                          {translate('table_habits.t_head.item4')}
                        </th>
                        <th className="font-semibold text-left pr-4 pl-4 pt-3.5 whitespace-nowrap">
                          {translate('table_habits.t_head.item5')}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="align-top">
                      {habits.map(habit => {
                        return (
                          <tr
                            key={habit.id}
                            className="border-t border-b-0 border-gray-900/30 first:border-t-0"
                          >
                            <td className="align-middle tabular-nums text-left p-4 whitespace-nowrap">
                              {habit.id.substring(0, 8)}
                            </td>
                            <td className="align-middle tabular-nums text-left p-4 whitespace-nowrap">
                              {habit.title}
                            </td>
                            <td className="align-middle tabular-nums text-left p-4 gap-2 hidden lg:flex">
                              {habit.tasks.slice(0, 4).map((task, index) => (
                                <span
                                  className="p-2 bg-gray-950 rounded-xl  whitespace-nowrap"
                                  key={index}
                                >
                                  {task.name}
                                </span>
                              ))}
                            </td>
                            <td className="align-middle tabular-nums text-left p-4 whitespace-nowrap hidden sm:table-cell">
                              {dayjs(habit.createdAt).format('YYYY-MM-DD')}
                            </td>
                            <td className="align-middle tabular-nums text-left p-4 whitespace-nowrap">
                              <Button variant="blue" size="sm" asChild>
                                <Link href={`/dashboard/habit/${habit.id}`}>
                                  {translate('table_habits.t_head.button')}
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollArea>
              </div>
            )}
          </div>
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
