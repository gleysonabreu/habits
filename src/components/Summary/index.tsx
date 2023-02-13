import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { CircleNotch } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../../libs/axios';
import { createCalendar } from '../../utils/calendar';
import { menuCalendar } from '../../utils/menu-calendar';
import { TaskDay } from './TaskDay';

dayjs.extend(utc);

type SummaryProps = {
  id: string;
};

export type SummaryItem = {
  id: string;
  date: Date;
  completed: number;
  amount: number;
};

export function Summary({ id }: SummaryProps) {
  const calendar = createCalendar();
  const [data, setData] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const loadingSummary = () => {
        setLoading(true);
        api.get(`/summary/${id}`).then(res => {
          setData(res.data.summary);
          setLoading(false);
        });
      };

      loadingSummary();
    }
  }, [id]);

  const { i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  const totalAmountToFill = 1 * 7; // 1 Week;
  const amountOfDaysToFill =
    calendar.length - (calendar.length - totalAmountToFill);
  return (
    <div className="w-full flex flex-1 lg:flex-none">
      <Head>
        <title>Habits</title>
      </Head>
      <div className="flex w-full justify-center lg:items-center lg:justify-start">
        {loading ? (
          <div className="flex flex-1 justify-center items-center">
            <CircleNotch size={35} className="animate-spin" />
          </div>
        ) : (
          <section className="flex max-w-2xl max-h-[350px] flex-col lg:flex-row">
            <div className="lg:mr-3 mb-3 lg:mb-0 grid grid-flow-col grid-cols-7 lg:grid-cols-[none] lg:grid-flow-row lg:grid-rows-7 gap-2">
              {menuCalendar.map((week, index) => {
                return (
                  <div
                    key={index}
                    className="bg-brand-blue-mid rounded-lg capitalize text-zinc-100 text-base lg:text-xl lg:h-10 lg:w-10 h-8 w-8 font-bold flex items-center justify-center"
                  >
                    {dayjs()
                      .weekday(week.weekDayName)
                      .format('dddd')
                      .substring(0, 1)}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-flow-row lg:grid-flow-col gap-2 grid-cols-7 lg:grid-cols-[none] lg:grid-rows-7">
              {calendar.map(date => {
                const convertDate = dayjs(date).utc().local();
                const findSummaryByDate = data.find(summary => {
                  const summaryDate = String(summary.date).split('T')[0];
                  return convertDate.format('YYYY-MM-DD') === summaryDate;
                });

                return (
                  <TaskDay
                    key={date.toString()}
                    defaultAmount={findSummaryByDate?.amount}
                    defaultCompleted={findSummaryByDate?.completed}
                    habitId={id}
                    date={convertDate.toDate()}
                  />
                );
              })}
              {amountOfDaysToFill > 0 &&
                Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                  return (
                    <div
                      key={i}
                      className="lg:w-10 lg:h-10 w-8 h-8 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                    />
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
