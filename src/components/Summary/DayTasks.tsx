import { Checkbox } from './Checkbox';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { Alert } from '../Alert';
import { useEffect } from 'react';
import { LoadingCheckBox } from '../LoadingCheckBox';

type DayTasksProps = {
  habitId: string;
  date: Date;
  handleCompleted: (completed: number) => void;
  handleAmount: (amount: number) => void;
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

export function DayTaks({
  habitId,
  date,
  handleCompleted,
  handleAmount,
}: DayTasksProps) {
  const weekDay = dayjs(date).get('day');
  const dateNow = dayjs(date).format('YYYY-MM-DD');
  const {
    data: dayTasksList,
    error,
    isLoading,
  } = useSWR<DayTasksList, Error>(
    `/api/v1/days/${habitId}?date=${dateNow}&weekDay=${weekDay}`,
  );

  useEffect(() => {
    if (dayTasksList) {
      handleAmount(dayTasksList.possibleTasks.length);
    }
  }, [handleAmount, dayTasksList]);

  function handleAddCompleted(taskId: string) {
    let tasksCompleted: string[] = [];
    if (dayTasksList) {
      const findTask = dayTasksList.completedTasks.includes(taskId);
      if (findTask) {
        tasksCompleted = dayTasksList.completedTasks.filter(
          (id) => id !== taskId,
        );
      } else {
        tasksCompleted = [...dayTasksList.completedTasks, taskId];
      }

      dayTasksList.completedTasks = tasksCompleted;
    }

    handleCompleted(tasksCompleted.length);
  }

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
            <Checkbox
              key={dayTask.id}
              date={date}
              handleCompleted={handleAddCompleted}
              taskName={dayTask.name}
              taskId={dayTask.id}
              isCompleted={isCompleted}
            />
          );
        })
      )}
    </div>
  );
}
