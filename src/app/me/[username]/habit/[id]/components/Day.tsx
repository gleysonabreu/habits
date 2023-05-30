import { Popover } from '@/components/Popover';
import { ProgressBar } from '@/components/ProgressBar';
import dayjs from 'dayjs';
import { DayTaks } from './DayTasks';

type DayProps = {
  date: Date;
  completed?: number;
  amount?: number;
  habitId: string;
};

export function Day({ habitId, date, amount = 0, completed = 0 }: DayProps) {
  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  return (
    <Popover date={date} completedPercentage={completedPercentage}>
      <div className="flex flex-col">
        <span className="font-semibold capitalize text-zinc-500 dark:text-zinc-400">
          {dayOfWeek}
        </span>
        <span className="mt-1 font-extrabold leading-tight text-3xl">
          {dayAndMonth}
        </span>
      </div>

      <ProgressBar progress={completedPercentage} />
      <DayTaks habitId={habitId} date={date} />
    </Popover>
  );
}
