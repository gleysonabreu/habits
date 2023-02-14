import { zodResolver } from '@hookform/resolvers/zod';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { api } from '../libs/axios';
import { menuCalendar } from '../utils/menu-calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { ToggleItem } from './ToggleItem';

type CreateTaskInputs = {
  task: string;
  weekDays: string[];
};

export function CreateTaskDialog() {
  const [loadingCreateTask, setLoadingCreateTask] = useState<boolean>(false);
  const router = useRouter();

  const { t: translate, i18n } = useTranslation('common');
  dayjs.locale(i18n.resolvedLanguage);

  const schema = z.object({
    task: z.string().min(3),
    weekDays: z.array(z.string().min(1)).nonempty(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateTaskInputs>({
    resolver: zodResolver(schema),
  });

  const handleCreateTask: SubmitHandler<CreateTaskInputs> = async data => {
    try {
      setLoadingCreateTask(true);
      const id = router.query.id as string;
      await api.post(`/habits/${id}/task`, {
        task: data.task.trim(),
        weekDays: data.weekDays.map(Number),
      });
      reset();
      toast.success(translate('messages.task_created'));
      setLoadingCreateTask(false);
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
  };
  return (
    <Dialog title={translate('create_task.title')}>
      <form
        onSubmit={handleSubmit(handleCreateTask)}
        className="mt-8 flex flex-col gap-4"
      >
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_task.exercise.label')}
            <p>{translate('create_task.exercise.subtitle')}</p>
          </label>
          <input
            {...register('task', { required: true })}
            placeholder="Exercise, sleep well, ete..."
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
              {translate('create_task.messages.task_required')}
            </p>
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('create_task.recurrence.label')}
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
              {translate('create_task.messages.week_days_required')}
            </p>
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-5 mb-3">
          <Button
            size="lg"
            variant="green"
            type="submit"
            isLoading={loadingCreateTask}
          >
            <Check size={24} />
            {translate('create_task.button')}
          </Button>
        </fieldset>
      </form>
    </Dialog>
  );
}
