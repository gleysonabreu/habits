import { Check } from '@phosphor-icons/react';
import * as CheckboxRadix from '@radix-ui/react-checkbox';
import { useState } from 'react';
import { LoadingCheckBox } from '../LoadingCheckBox';
import { Alert, AlertProps } from '../Alert';
import dayjs from 'dayjs';

type CheckboxProps = {
  taskId: string;
  taskName: string;
  isCompleted: boolean;
  date: Date;
  handleCompleted: (taskId: string) => void;
}

type Message = AlertProps;

export function Checkbox({ taskId, date, taskName, isCompleted, handleCompleted }: CheckboxProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const past = dayjs(date).endOf('day').isBefore(dayjs());
  const dateNow = dayjs(date).format('YYYY-MM-DD');

  async function handleToggleCompleted() {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateNow,
        }),
      });

      setMessage(null);
      const responseBody = await response.json();

      if (response.status === 201) {
        handleCompleted(taskId);
        setLoading(false);
        return;
      }

      if (response.status === 400) {
        if (responseBody.errors) {
          const errors = responseBody.errors;

          errors.forEach((error: any) => {
            setMessage({
              type: 'warning',
              title: 'Bad Request',
              text: error.message,
            });
          });

          setLoading(false);
          return;
        }

        setMessage({
          type: 'warning',
          title: 'Bad Request',
          text: responseBody.message,
        });
        setLoading(false);
        return;
      }

      if (response.status === 401) {
        setMessage({
          title: 'Erro',
          type: 'danger',
          text: responseBody.message,
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      setMessage({
        title: 'Erro',
        type: 'danger',
        text: 'Não foi possível se conectar ao Hábitos. Por favor, verifique sua conexão.'
      });
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingCheckBox />
    );
  }

  return (
    <>
      {message && (
        <Alert {...message} />
      )}
      <CheckboxRadix.Root
        onClick={handleToggleCompleted}
        className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
        defaultChecked={isCompleted}
        disabled={past}
      >
        <div className='group-focus:ring-2 group-focus:ring-brand-primary h-8 w-8 rounded-xl flex items-center justify-center bg-zinc-300 dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-800 group-data-[state=checked]:bg-brand-green group-data-[state=checked]:border-green-200'>
          <CheckboxRadix.Indicator>
            <Check size={20} className='text-white' />
          </CheckboxRadix.Indicator>
        </div>

        <span className='font-semibold text-xl text-zinc-400 dark:text-zinc-500 leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
          {taskName}
        </span>
      </CheckboxRadix.Root>
    </>
  );
}
