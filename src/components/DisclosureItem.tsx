import { Disclosure, Transition } from '@headlessui/react';
import { Habit } from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { CaretUp, CircleNotch } from 'phosphor-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../libs/axios';
import { createCalendar } from '../utils/calendar';
import { menuCalendar } from '../utils/menu-calendar';
import { Activity } from './Summary/Activity';
import { Tooltip } from './Tooltip';

dayjs.extend(utc);

type Summary = {
  amount: number;
  completed: number;
  date: Date;
  id: string;
};

type DisclosureItemProps = {
  habit: Habit;
};

export function DisclosureItem({ habit }: DisclosureItemProps) {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);

  const calendar = createCalendar();

  const { t: translate, i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  async function handleGetCalendar(stateDisclosure: boolean) {
    if (stateDisclosure === false && summaries.length === 0) {
      try {
        setLoading(true);
        const res = await api.get(`/summary/${habit.id}`);
        setSummaries(res.data.summary);
        setLoading(false);
      } catch (error: any) {
        toast.error(translate('messages.something_went_wrong'));
        setLoading(false);
      }
    }
  }
  return (
    <Disclosure as="div" className="mt-2">
      {({ open }) => (
        <>
          <Disclosure.Button
            onClick={() => handleGetCalendar(open)}
            className="flex w-full items-center justify-between rounded-xl bg-zinc-900 px-4 py-2 text-left font-medium text-zinc-100 hover:bg-zinc-800 focus:outline-none focus-visible:ring focus-visible:ring-zinc-500 focus-visible:ring-opacity-75"
          >
            <span className="text-lg">{habit.title}</span>
            <CaretUp
              className={classNames('h-5 w-5 text-zinc-100', {
                'rotate-180 transform': open,
              })}
            />
          </Disclosure.Button>
          {loading ? (
            <div className="w-full p-2 flex items-center justify-center">
              <CircleNotch size={35} className="animate-spin" />
            </div>
          ) : (
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel
                className="lg:px-4 pt-4 pb-2 text-sm text-gray-500"
                static
              >
                <div className="w-full flex items-center justify-center relative flex-col lg:flex-row">
                  <div className="lg:mr-3 mb-3 lg:mb-0 grid grid-flow-col grid-cols-7 lg:grid-cols-[none] lg:grid-flow-row lg:grid-rows-7 lg:gap-3 gap-3">
                    {menuCalendar.map((week, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-brand-blue-mid rounded-lg capitalize text-zinc-100 text-base lg:text-xl lg:h-10 lg:w-10 h-8 w-8 font-bold flex items-center justify-center"
                        >
                          {dayjs()
                            .weekday(Number(week.weekDayName))
                            .format('dddd')
                            .substring(0, 1)}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-flow-row lg:grid-flow-col gap-3 grid-cols-7 lg:grid-cols-[none] lg:grid-rows-7">
                    {calendar.map((date, index) => {
                      const convertDate = dayjs(date).utc().local();
                      const findSummaryByDate = summaries.find(summary => {
                        const summaryDate = String(summary.date).split('T')[0];
                        return convertDate.format('YYYY-MM-DD') === summaryDate;
                      });

                      const completed = findSummaryByDate?.completed || 0;
                      const dateFormatted = dayjs(date).format('MMM DD, YYYY');
                      const title = `${dateFormatted}, ${translate(
                        'profile.completed',
                      )}: ${completed}`;

                      return (
                        <Tooltip key={index} tooltipTitle={title}>
                          <Activity completed={completed} />
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          )}
        </>
      )}
    </Disclosure>
  );
}
