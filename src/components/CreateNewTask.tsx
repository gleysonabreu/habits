'use client';
import { Button } from '@/components/Button';
import { Plus } from '@phosphor-icons/react';
import Modal from './Modal';
import { useState } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { z } from 'zod';
import { Alert, AlertProps } from './Alert';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import dayjs from 'dayjs';
import { ToggleItem } from './ToggleItem';
import { Form } from './Form';
import { weekDaysAvailable } from '@/utils/week-days-avaiable';

type HeaderHabitDetailsProps = {
  habitId: string;
};

type CreateTaskProps = {
  task: string;
  weekDays: string[];
};

type Message = AlertProps;

export function CreateNewTask({ habitId }: HeaderHabitDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const schema = z.object({
    task: z
      .string({
        required_error: 'Você deve digtar pelo menos um exercício ou tarefa.',
      })
      .nonempty({
        message: 'Você deve digtar pelo menos um exercício ou tarefa.',
      })
      .min(3, {
        message: 'A tarefa ou exercício deve conter pelo menos 3 caracteres',
      })
      .max(15, {
        message: 'A tarefa ou exercício deve conter no máximo 15 caracteres',
      }),
    weekDays: z
      .array(
        z
          .string({
            required_error: 'Selecione um dia da semana de segunda a sexta.',
          })
          .min(0, { message: 'Selecione um dia da semana de segunda a sexta.' })
          .max(6, {
            message: 'Selecione um dia da semana de segunda a sexta.',
          }),
        { required_error: 'Você deve selecionar pelo menos um dia da semana.' },
      )
      .nonempty({
        message: 'Você deve selecionar pelo menos um dia da semana.',
      }),
  });

  const createTaskForm = useForm<CreateTaskProps>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setError,
    control,
  } = createTaskForm;

  function clearErrors() {
    setMessage(null);
  }

  const handleAddTask: SubmitHandler<CreateTaskProps> = async (data) => {
    try {
      const response = await fetch(`/api/v1/habits/${habitId}/task`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: data.task,
          weekDays: data.weekDays.map(Number),
        }),
      });

      const responseBody = await response.json();

      if (response.status === 201) {
        setMessage({
          type: 'success',
          title: 'Sucesso!',
          text: 'Seu exercício ou tarefa foi inserido com sucesso!',
        });
        reset();
        return;
      }

      if (response.status === 400) {
        if (responseBody.errors) {
          const errors = responseBody.errors;

          errors.forEach((error: any) => {
            setError(error.path[0], { message: error.message });
          });
          return;
        }

        setMessage({
          type: 'warning',
          title: 'Bad Request',
          text: responseBody.message,
        });
        return;
      }

      if (response.status === 401) {
        setMessage({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        return;
      }

      if (response.status === 403) {
        setMessage({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        return;
      }

      if (response.status === 404) {
        setMessage({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        return;
      }
    } catch (err: any) {
      setMessage({
        text: 'Não foi possível se conectar ao Hábitos. Por favor, verifique sua conexão.',
        title: 'Erro',
        type: 'danger',
      });
    }
  };

  function closeModal() {
    setIsModalOpen(false);
    clearErrors();
    reset();
  }

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <>
      <Modal title="Criar tarefa" isOpen={isModalOpen} closeModal={closeModal}>
        <FormProvider {...createTaskForm}>
          <form
            onSubmit={handleSubmit(handleAddTask)}
            className="mx-auto mb-0 mt-8 max-w-md space-y-4"
          >
            {message && <Alert {...message} />}

            <Form.Field>
              <Form.Label htmlFor="task">Exercício ou Tarefa</Form.Label>
              <Form.ErrorMessage field="task" />
              <Form.Input
                name="task"
                type="text"
                placeholder="Exemplo: correr 2km"
                onChange={clearErrors}
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="weekDays">Dias da semana</Form.Label>
              <p className="text-sm text-zinc-600">
                Selecione os dias da semana do seu exercício ou tarefa.
              </p>
              <Form.ErrorMessage field="weekDays" />
              <Controller
                control={control}
                name="weekDays"
                render={({ field }) => (
                  <ToggleGroup.Root
                    {...field}
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid md:grid-cols-2 grid-cols-1 gap-2"
                    type="multiple"
                  >
                    {weekDaysAvailable.map((_weekDay, index) => {
                      const weekDayName = dayjs().weekday(index).format('dddd');

                      return (
                        <div key={index} className="flex items-center gap-2">
                          <ToggleItem
                            isChecked={
                              field.value?.includes(index.toString()) ?? false
                            }
                            value={index.toString()}
                            title={weekDayName}
                          />
                          <label className="text-base text-zinc-500 dark:text-zinc-400 text-left capitalize">
                            {weekDayName}
                          </label>
                        </div>
                      );
                    })}
                  </ToggleGroup.Root>
                )}
              />
            </Form.Field>

            <div className="flex items-center justify-between">
              <Button
                title="Criar tarefa ou exercício"
                type="submit"
                size="lg"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Criar
              </Button>

              <Button
                title="Cancelar"
                onClick={closeModal}
                type="button"
                size="lg"
                variant="red"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      <Button title="Nova tarefa" size="lg" variant="white" onClick={openModal}>
        <span className="block">Nova tarefa</span>
        <Plus
          size={16}
          className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5"
        />
      </Button>
    </>
  );
}
