import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../libs/axios';

type PossibleTask = {
  id: string;
  habitId: string;
  name: string;
};

type TaskListProps = {
  habitId: string;
  date: Date;
  onCompletedChanged: (completed: number) => void;
  onAmountChanged: (amount: number) => void;
};

export function TaskList({
  date,
  habitId,
  onCompletedChanged,
  onAmountChanged,
}: TaskListProps) {
  const [possibleTasks, setPossibleTasks] = useState<PossibleTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

  const { t: translate } = useTranslation('common');

  const convertDate = dayjs(date).format('YYYY-MM-DD');
  const weekDay = dayjs(date).get('day');

  useEffect(() => {
    api
      .get<{ completedTasks: string[]; possibleTasks: PossibleTask[] }>(
        `/days/${habitId}`,
        {
          params: {
            date: convertDate,
            weekDay,
          },
        },
      )
      .then(response => {
        setPossibleTasks(response.data.possibleTasks);
        setCompletedTasks(response.data.completedTasks);
        onAmountChanged(response.data.possibleTasks.length);
      });
  }, [convertDate, habitId, onAmountChanged, weekDay]);

  async function handleToggleTask(taskId: string) {
    const toastId = toast.loading(translate('messages.loading'));
    try {
      await api.post(`/tasks/${taskId}`, {
        date: convertDate,
      });

      const findCheckTask = completedTasks.includes(taskId);
      let tasksCompleted: string[] = [];

      if (findCheckTask) {
        tasksCompleted = completedTasks.filter(id => id !== taskId);
      } else {
        tasksCompleted = [...completedTasks, taskId];
      }

      setCompletedTasks(tasksCompleted);
      onCompletedChanged(tasksCompleted.length);
      toast.update(toastId, {
        type: 'success',
        render: translate('messages.task_success'),
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(toastId, {
        type: 'error',
        render: translate('messages.something_went_wrong'),
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  }
  return (
    <div className="mt-6 flex flex-col gap-3">
      {possibleTasks.map(task => {
        const isCompleted = completedTasks.includes(task.id);
        return (
          <Checkbox.Root
            onClick={() => handleToggleTask(task.id)}
            key={task.id}
            className="flex items-center gap-3 group focus:outline-none"
            defaultChecked={isCompleted}
            disabled={isDateInPast}
          >
            <div className="group-focus:ring-2 group-ring-opacity-40 group-focus:ring-zinc-500 h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {task.name}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}
