'use client';
import * as PopoverRadix from '@radix-ui/react-popover';
import { ReactNode } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';

type PopoverProps = {
  completedPercentage: number;
  children: ReactNode;
  date: Date;
}

export function Popover({ completedPercentage, children, date }: PopoverProps) {
  const dateFormatted = dayjs(date).format('DD/MM/YYYY');
  return (
    <PopoverRadix.Root>
      <PopoverRadix.Trigger title={dateFormatted} className={clsx('h-10 w-10 lg:h-5 lg:w-5 rounded-xl lg:rounded-md border-2 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-zinc-900 focus:ring-offset-zinc-100 focus:ring-sky-600', {
        'bg-zinc-300 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-900': completedPercentage === 0,
        'bg-blue-500 border-blue-400': completedPercentage > 0 && completedPercentage < 20,
        'bg-blue-600 border-blue-500': completedPercentage >= 20 && completedPercentage < 40,
        'bg-blue-700 border-blue-500': completedPercentage >= 40 && completedPercentage < 60,
        'bg-blue-800 border-blue-500': completedPercentage >= 60 && completedPercentage < 80,
        'bg-blue-900 border-blue-500': completedPercentage >= 80
      })
      } />

      <PopoverRadix.Portal>
        <PopoverRadix.Content className='gap-3 min-w-[320px] shadow-lg p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex flex-col focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:outline-none dark:focus:ring-offset-zinc-800 focus:ring-offset-zinc-100 focus:ring-zinc-300 dark:focus:ring-zinc-900'>
          {children}
          <PopoverRadix.PopoverArrow height={8} width={16} className='fill-zinc-100 dark:fill-zinc-800' />
        </PopoverRadix.Content>
      </PopoverRadix.Portal>
    </PopoverRadix.Root>
  );
}
