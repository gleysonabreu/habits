import { zodResolver } from '@hookform/resolvers/zod';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useHabits } from '../hooks/useHabits';
import { menuCalendar } from '../utils/menu-calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { ToggleItem } from './ToggleItem';

type CreateHabitInputs = {
  title: string;
  task: string;
  weekDays: string[];
};

export function CreateHabitDialog() {
  const [loadingCreateHabit, setLoadingCreateHabit] = useState<boolean>(false);
  const { createHabit } = useHabits();
  const { t: translate, i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  const schema = z.object({
    title: z.string().min(3).max(50),
    task: z.string().min(3),
    weekDays: z.array(z.string().min(1)).nonempty(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateHabitInputs>({
    resolver: zodResolver(schema),
  });

  const handleCreateHabit: SubmitHandler<CreateHabitInputs> = async data => {
    try {
      setLoadingCreateHabit(true);
      const tasks = data.task
        .split(',')
        .map(task => task.trim())
        .filter(task => task !== '' && task.length > 2);

      await createHabit({ tasks, title: data.title, weekDays: data.weekDays });
      toast.success(translate('messages.habit_created'));
      setLoadingCreateHabit(false);
      reset();
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
  };
  return (
    <Dialog title={translate('create_habit.title')}>
      <form
        onSubmit={handleSubmit(handleCreateHabit)}
        className="mt-8 flex flex-col gap-4"
      >
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.title')}
          </label>
          <input
            {...register('title', { required: true })}
            placeholder={translate('create_habit.form.title.label') as string}
            className={classNames(
              'focus:outline-none focus:ring-2 ring-opacity-40 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6',
              {
                'ring-gray-950': !errors.title,
                'ring-red-500': errors.title,
              },
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {translate('create_habit.form.messages.enter_title')}
            </p>
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.form.exercise.label')}
            <p>{translate('create_habit.form.exercise.subtitle')}</p>
          </label>
          <input
            {...register('task', { required: true })}
            placeholder={
              translate(
                'create_habit.form.exercise.placeholder_input',
              ) as string
            }
            className={classNames(
              'focus:outline-none focus:ring-2 ring-opacity-40 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md h-6',
              {
                'ring-gray-950': !errors.task,
                'ring-red-500': errors.task,
              },
            )}
          />
          {errors.task && (
            <p className="text-red-500 text-sm">
              {translate('create_habit.form.messages.add_one_task')}
            </p>
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_habit.form.recurrence.label')}
          </label>
          <Controller
            control={control}
            name="weekDays"
            render={({ field }) => (
              <ToggleGroup.Root
                type="multiple"
                {...field}
                className="grid grid-cols-2 gap-2"
                value={field.value}
                onValueChange={field.onChange}
              >
                {menuCalendar.map((week, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ToggleItem
                      isChecked={
                        field.value?.includes(index.toString()) ?? false
                      }
                      value={index.toString()}
                      title={dayjs().weekday(week.weekDayName).format('dddd')}
                    />
                    <label className="text-base text-gray-200 text-left capitalize">
                      {dayjs().weekday(week.weekDayName).format('dddd')}
                    </label>
                  </div>
                ))}
              </ToggleGroup.Root>
            )}
          />

          {errors.weekDays && (
            <p className="text-red-500 text-sm">
              {translate('create_habit.form.messages.select_a_day')}
            </p>
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <Button
            size="lg"
            variant="green"
            type="submit"
            isLoading={loadingCreateHabit}
          >
            <Check size={24} />
            {translate('create_habit.form.button')}
          </Button>
        </fieldset>
      </form>
    </Dialog>
  );
}
