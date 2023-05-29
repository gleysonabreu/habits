'use client';
import { generateDates } from "@/utils/generate-dates";
import { Day } from "./Day";
import dayjs from "dayjs";
import { daysOfWeek } from "@/utils/days-of-week";

type Summary = {
  id: string;
  date: Date;
  completed: number;
  amount: number;
}

type SummaryProps = {
  summary: Summary[];
  habit: {
    id: string;
  }
}

export function SummaryList({ summary, habit }: SummaryProps) {
  const summaryDates = generateDates();

  return (
    <div className='w-full flex flex-col lg:flex-row gap-3 items-center justify-center'>
      <div className='grid grid-cols-7 lg:grid-cols-none lg:grid-rows-7 grid-flow-col lg:grid-flow-row gap-1'>
        {daysOfWeek.map((weekDay, index) => (
          <div key={index} className='h-10 w-10 lg:h-5 lg:w-5 rounded-xl lg:rounded-md font-bold lg:text-xs flex items-center justify-center text-zinc-100 bg-brand-primary border-2 border-brand-secondary'>
            {weekDay}
          </div>
        ))}
      </div>

      <div className='grid grid-flow-row lg:grid-flow-col grid-cols-7 lg:grid-cols-none lg:grid-rows-7 gap-1'>
        {summaryDates.map(date => {
          const dayInSummary = summary.find(day => {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedDayDate = dayjs.utc(day.date).format('YYYY-MM-DD');

            return formattedDate === formattedDayDate;
          });

          return (
            <Day
              key={date.toString()}
              defaultCompleted={dayInSummary?.completed}
              defaultAmount={dayInSummary?.amount}
              date={date}
              habitId={habit.id}
            />
          );
        })}
      </div>
    </div>
  );
}
