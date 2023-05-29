'use client';
import { Button } from "@/components/Button";
import { Plus } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Modal from "./Modal";
import { useState } from "react";
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import dayjs from "dayjs";
import { ToggleItem } from "./ToggleItem";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertProps } from "./Alert";
import { Form } from "./Form";
import { useRouter } from 'next/navigation';
import { weekDaysAvailable } from "@/utils/week-days-avaiable";

type CreateHabitProps = {
  title: string;
  tasks: string;
  weekDays: string[];
}

type MessageRequest = AlertProps;

export function HeaderSection() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageRequest, setMessageRequest] = useState<MessageRequest | null>(null);

  const schema = z.object({
    title: z.string({ required_error: 'Você deve digitar algum título' }).nonempty({ message: 'Você deve digitar algum título' }).min(3, { message: 'O título deve conter pelo menos 3 caracteres' }).max(15, { message: "O título deve conter no máximo 15 caracteres" }),
    tasks: z.string({ required_error: 'Você deve digtar pelo menos um exercício ou tarefa.' }).nonempty({ message: 'Você deve digtar pelo menos um exercício ou tarefa.' }).min(3, { message: 'A tarefa ou exercício deve conter pelo menos 3 caracteres' }),
    weekDays: z.array(z.string().min(0, { message: "Selecione um dia da semana de segunda a sexta." }).max(6, { message: "Selecione um dia da semana de segunda a sexta." }), { required_error: 'Você deve selecionar pelo menos um dia da semana.' }).nonempty({ message: 'Você deve selecionar pelo menos um dia da semana.' }),
  });

  const createHabitForm = useForm<CreateHabitProps>({
    resolver: zodResolver(schema)
  });

  const { handleSubmit, formState: { isSubmitting }, reset, setError, control } = createHabitForm;

  function clearErrors() {
    setMessageRequest(null);
  }

  const handleAddHabit: SubmitHandler<CreateHabitProps> = async (data) => {
    try {
      const tasks = data.tasks.split(',')
        .map(task => task.trim());

      if (!tasks.every(task => task.length >= 3)) {
        setError('tasks', { type: 'custom', message: 'Alguma(s) tarefa(s) ou exercício(s) estão inválidos. Todos devem conter entre 3 e 15 caracteres.' }, { shouldFocus: true });
        return;
      };

      const response = await fetch('/api/v1/habits', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tasks,
          title: data.title,
          weekDays: data.weekDays.map(Number)
        }),
      });


      const responseBody = await response.json();

      if (response.status === 201) {
        setMessageRequest({
          type: 'success',
          title: 'Sucesso',
          text: 'Hábito criado com sucesso!',
        });
        router.push(`/dashboard/habit/${responseBody.habit.id}`);
      }

      if (response.status === 400) {
        if (responseBody.errors) {
          const errors = responseBody.errors;

          errors.forEach((error: any) => {
            setError(error.path[0], { message: error.message });
          });
          return;
        }

        setMessageRequest({
          type: 'warning',
          title: 'Bad Request',
          text: responseBody.message,
        });
        return;
      }

      if (response.status === 401) {
        setMessageRequest({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        return;
      }

      if (response.status === 403) {
        setMessageRequest({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        return;
      }
    } catch (err: any) {
      setMessageRequest({
        text: 'Não foi possível se conectar ao Hábitos. Por favor, verifique sua conexão.',
        title: 'Erro',
        type: 'danger'
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
    <header>
      <Modal title="Criar hábito" isOpen={isModalOpen} closeModal={closeModal}>
        <FormProvider {...createHabitForm}>
          <form onSubmit={handleSubmit(handleAddHabit)} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            {messageRequest && (
              <Alert type={messageRequest.type} text={messageRequest.text} title={messageRequest.title} />
            )}
            <Form.Field>
              <Form.Label htmlFor="title">
                Título
              </Form.Label>
              <Form.ErrorMessage field="title" />
              <Form.Input
                name="title"
                type="text"
                onChange={clearErrors}
                placeholder="Digite o título..."
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="tasks">
                Exercios ou Tarefas
              </Form.Label>
              <p className='text-sm text-zinc-600'>Para adicionar mais de 1 exercício útilize a vírgula(,): beber 2L água, dormir....</p>
              <Form.ErrorMessage field="tasks" />
              <Form.Input
                name="tasks"
                type="text"
                onChange={clearErrors}
                placeholder="Exemplo: correr, beber 2L água, dormir, acordar 6AM, etc..."
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="weekDays">
                Dias da semana
              </Form.Label>
              <p className='text-sm text-zinc-600'>Selecione os dias da semana dos seus exercícios.</p>
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
                            isChecked={field.value?.includes(index.toString()) ?? false}
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
              <Button title="Criar hábito" type="submit" size='lg' disabled={isSubmitting} loading={isSubmitting}>
                Criar
              </Button>

              <Button title='Cancelar' onClick={closeModal} type="button" size='lg' variant='red'>
                Cancelar
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Bem-vindo de volta, {session?.user?.name}!
            </h1>

            <p className="mt-1.5 text-sm text-gray-400 dark:text-gray-500">
              Vamos criar novos hábitos?
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <Button title='Criar hábito' size="lg" variant="white" onClick={openModal}>
              <span className="block">Novo hábito</span>
              <Plus size={16} className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
