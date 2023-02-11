import * as Popover from '@radix-ui/react-popover';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import { Activity } from './Activity';
import { TaskList } from './TaskList';

type TaskDayProps = {
  habitId: string;
  defaultCompleted?: number;
  defaultAmount?: number;
  date: Date;
};

export function TaskDay({
  habitId,
  defaultCompleted = 0,
  defaultAmount = 0,
  date,
}: TaskDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const [amount, setAmount] = useState(defaultAmount);

  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  function handleCompletedChanged(completed: number) {
    setCompleted(completed);
  }

  const handleAmountChanged = useCallback((amount: number) => {
    setAmount(amount);
  }, []);

  return (
    <Popover.Root>
      <Popover.Trigger className="rounded-lg focus:outline-none focus:ring-2 ring-opacity-40 ring-zinc-500">
        <Activity completed={completed} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="focus:outline-none focus:ring-2 ring-opacity-40 ring-zinc-500 min-w-[320px] p-6 rounded-2xl bg-zinc-900 gap-2 flex flex-col">
          <span className="font-semibold text-zinc-400 capitalize">
            {dayOfWeek}
          </span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <ProgressBar progress={completedPercentage} />

          <TaskList
            habitId={habitId}
            date={date}
            onCompletedChanged={handleCompletedChanged}
            onAmountChanged={handleAmountChanged}
          />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
