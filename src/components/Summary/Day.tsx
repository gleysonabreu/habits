'use client';
import { ProgressBar } from '../ProgressBar';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DayTaks } from './DayTasks';
import { Popover } from '../Popover';

type DayProps = {
  date: Date;
  defaultCompleted?: number;
  defaultAmount?: number;
  habitId: string;
}

export function Day({ habitId, date, defaultAmount = 0, defaultCompleted = 0 }: DayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const [amount, setAmount] = useState(defaultAmount);

  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');

  function handleCompletedChaged(completed: number) {
    setCompleted(completed);
  }

  function onChangeAmount(amount: number) {
    setAmount(amount);
  }

  return (
    <Popover date={date} completedPercentage={completedPercentage}>
      <div className='flex flex-col'>
        <span className='font-semibold capitalize text-zinc-500 dark:text-zinc-400'>{dayOfWeek}</span>
        <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>
      </div>

      <ProgressBar progress={completedPercentage} />
      <DayTaks habitId={habitId} date={date} handleCompleted={handleCompletedChaged} handleAmount={onChangeAmount} />
    </Popover>
  );
}
