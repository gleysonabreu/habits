import useSWR from 'swr';
import dayjs from 'dayjs';
import { LoadingCheckBox } from '@/components/LoadingCheckBox';
import { Alert } from '@/components/Alert';
import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { Check } from '@phosphor-icons/react';

type DayTasksProps = {
  habitId: string;
  date: Date;
};

type Tasks = {
  id: string;
  name: string;
  createdAt: Date;
  habitId: string;
};

type DayTasksList = {
  completedTasks: string[];
  possibleTasks: Tasks[];
};

export function DayTaks({ habitId, date }: DayTasksProps) {
  const weekDay = dayjs(date).get('day');
  const dateNow = dayjs(date).format('YYYY-MM-DD');
  const {
    data: dayTasksList,
    error,
    isLoading,
  } = useSWR<DayTasksList, Error>(
    `/api/v1/days/${habitId}?date=${dateNow}&weekDay=${weekDay}`,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3).keys()].map((i) => (
          <LoadingCheckBox key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        text="Ocorreu um erro interno, tente novamente."
        type="danger"
        title="Internal Server Error"
      />
    );
  }

  return (
    <div className="flex gap-3 flex-col w-full p-2 max-h-36 overflow-x-auto">
      {dayTasksList?.possibleTasks.length === 0 ? (
        <span className="text-zinc-400 dark:text-zinc-500">
          Nenhuma tarefa encrontada.
        </span>
      ) : (
        dayTasksList?.possibleTasks.map((dayTask) => {
          const isCompleted = dayTasksList.completedTasks.includes(dayTask.id);
          return (
            <CheckboxRadix.Root
              key={dayTask.id}
              className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
              defaultChecked={isCompleted}
              disabled
            >
              <div className="group-focus:ring-2 group-focus:ring-brand-primary h-8 w-8 rounded-xl flex items-center justify-center bg-zinc-300 dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-800 group-data-[state=checked]:bg-brand-green group-data-[state=checked]:border-green-200">
                <CheckboxRadix.Indicator>
                  <Check size={20} className="text-white" />
                </CheckboxRadix.Indicator>
              </div>

              <span className="font-semibold text-xl text-zinc-400 dark:text-zinc-500 leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {dayTask.name}
              </span>
            </CheckboxRadix.Root>
          );
        })
      )}
    </div>
  );
}
