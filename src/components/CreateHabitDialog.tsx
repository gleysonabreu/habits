import * as ToggleGroup from '@radix-ui/react-toggle-group';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useHabits } from '../hooks/useHabits';
import { menuCalendar } from '../utils/menu-calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { ToggleItem } from './ToggleItem';

export function CreateHabitDialog() {
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loadingCreateHabit, setLoadingCreateHabit] = useState<boolean>(false);

  const { createHabit } = useHabits();

  const { t: translate, i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  async function handleCreateHabit() {
    setLoadingCreateHabit(true);

    if (weekDays.length === 0) {
      toast.error(translate('messages.select_a_day'));
      setLoadingCreateHabit(false);
      return;
    }

    if (tasks.length === 0) {
      toast.error(translate('messages.add_one_task'));
      setLoadingCreateHabit(false);
      return;
    }

    if (title === '') {
      toast.error(translate('messages.enter_title'));
      setLoadingCreateHabit(false);
      return;
    }

    try {
      const tasksArray = tasks.split(',').map(task => task.trim());
      await createHabit({ tasks: tasksArray, weekDays, title });
      toast.success(translate('messages.habit_created'));

      setLoadingCreateHabit(false);
      setWeekDays([]);
      setTasks('');
    } catch (error: any) {
      if (error.response) {
        const isArray = Array.isArray(error.response.data);
        const message = isArray
          ? translate('messages.fill_the_information')
          : error.response.data.message;
        toast.error(message);
      } else {
        toast.error(translate('messages.something_went_wrong'));
        setLoadingCreateHabit(false);
      }
    }
  }
  return (
    <Dialog title={translate('create_habit.title')}>
      <div className="mt-8 flex flex-col gap-4">
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.title')}
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={translate('create_habit.form.title.label') as string}
            className="focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.form.exercise.label')}
            <p>{translate('create_habit.form.exercise.subtitle')}</p>
          </label>
          <input
            value={tasks}
            onChange={e => setTasks(e.target.value)}
            placeholder={
              translate(
                'create_habit.form.exercise.placeholder_input',
              ) as string
            }
            className="focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.form.recurrence.label')}
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
                  title={dayjs()
                    .weekday(Number(week.weekDayName))
                    .format('dddd')}
                />
                <label className="text-base text-gray-200 text-left capitalize">
                  {dayjs().weekday(Number(week.weekDayName)).format('dddd')}
                </label>
              </div>
            ))}
          </ToggleGroup.Root>
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <Button
            size="lg"
            variant="green"
            onClick={handleCreateHabit}
            isLoading={loadingCreateHabit}
          >
            <Check size={24} />
            {translate('create_habit.form.button')}
          </Button>
        </fieldset>
      </div>
    </Dialog>
  );
}
