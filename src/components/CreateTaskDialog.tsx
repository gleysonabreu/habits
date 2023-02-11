import * as ToggleGroup from '@radix-ui/react-toggle-group';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../libs/axios';
import { menuCalendar } from '../utils/menu-calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { ToggleItem } from './ToggleItem';

export function CreateTaskDialog() {
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [task, setTask] = useState<string>('');
  const [loadingCreateTask, setLoadingCreateTask] = useState<boolean>(false);
  const router = useRouter();

  const { t: translate, i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  async function handleCreateTask() {
    setLoadingCreateTask(true);

    if (weekDays.length === 0) {
      toast.error(translate('messages.select_a_day'));
      setLoadingCreateTask(false);
      return;
    }

    if (task === '') {
      toast.error(translate('messages.add_one_task'));
      setLoadingCreateTask(false);
      return;
    }

    try {
      const id = router.query.id as string;
      await api.post(`/habits/${id}/task`, {
        task: task.trim(),
        weekDays: weekDays.map(Number),
      });

      toast.success(translate('messages.task_created'));
      setLoadingCreateTask(false);
      setWeekDays([]);
      setTask('');
    } catch (error: any) {
      if (error.response.data) {
        const isArray = Array.isArray(error.response.data);
        const message = isArray
          ? translate('messages.fill_the_information')
          : error.response.data.message;
        toast.error(message);
      } else {
        toast.error(translate('messages.something_went_wrong'));
      }

      setLoadingCreateTask(false);
    }
  }
  return (
    <Dialog title={translate('create_task.title')}>
      <div className="mt-8 flex flex-col gap-4">
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_task.exercise.label')}
            <p>{translate('create_task.exercise.subtitle')}</p>
          </label>
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Exercise, sleep well, ete..."
            className="focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_task.recurrence.label')}
          </label>
          <ToggleGroup.Root
            type="multiple"
            className="grid grid-cols-2 gap-2"
            value={weekDays}
            onValueChange={setWeekDays}
          >
            {menuCalendar.map((week, index) => (
              <div key={index} className="flex items-center gap-2">
                <ToggleItem
                  isChecked={weekDays.includes(index.toString())}
                  value={index.toString()}
                  title={dayjs().weekday(week.weekDayName).format('dddd')}
                />
                <label className="text-base text-gray-200 text-left capitalize">
                  {dayjs().weekday(week.weekDayName).format('dddd')}
                </label>
              </div>
            ))}
          </ToggleGroup.Root>
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <Button
            size="lg"
            variant="green"
            onClick={handleCreateTask}
            isLoading={loadingCreateTask}
          >
            <Check size={24} />
            {translate('create_task.button')}
          </Button>
        </fieldset>
      </div>
    </Dialog>
  );
}
