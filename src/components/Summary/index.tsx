'use client';
import { generateDates } from "@/utils/generate-dates";
import { Day } from "./Day";
import dayjs from "dayjs";

const daysOfTheWeek = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
];

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
  const minSummaryDatesSize = 18 * 7; // 18 weeks
  const amountOfDaysToFill = minSummaryDatesSize - summaryDates.length;

  return (
    <div className='w-full flex flex-col lg:flex-row gap-3 items-center justify-center'>
      <div className='grid grid-cols-7 lg:grid-cols-none lg:grid-rows-7 grid-flow-col lg:grid-flow-row gap-3'>
        {daysOfTheWeek.map((weekDay, index) => (
          <div key={index} className='h-10 w-10 font-bold flex items-center justify-center text-zinc-100 bg-brand-primary rounded-xl border-2 border-brand-secondary'>
            {weekDay}
          </div>
        ))}
      </div>

      <div className='grid grid-flow-row lg:grid-flow-col grid-cols-7 lg:grid-cols-none lg:grid-rows-7 gap-3'>
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

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div key={i} className="w-10 h-10 bg-zinc-300 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-900 border-2 rounded-xl opacity-40 cursor-not-allowed" />
          )
        })}
      </div>
    </div>
  );
}
