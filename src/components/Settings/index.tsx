import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { SideOvers } from "../SideOvers";
import { Form } from "../Form";
import { Alert, AlertProps } from "../Alert";
import clsx from "clsx";
import { CircleNotch } from "@phosphor-icons/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button";
import { useSession } from 'next-auth/react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyUrl } from './CopyUrl';

type MessageProps = AlertProps;

type UpdateUsernameForm = {
  username: string;
}

type SettingsProps = {
  open: boolean;
  close: () => void;
}

export function Settings({ open, close }: SettingsProps) {
  const { data: session } = useSession();

  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageGlobal, setMessageGlobal] = useState<MessageProps | null>(null);

  const schema = z.object({
    username: z.string({ required_error: 'Preencha o seu nome de usuário.' }).trim().min(3, { message: 'Digite pelo menos 3 caractres.' }).max(15, 'Digite no máximo 15 caracteres.').nonempty({ message: 'Preencha o seu nome de usuário.' }),
  });

  const updateUsernameForm = useForm<UpdateUsernameForm>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, formState: { isSubmitting }, setError } = updateUsernameForm;

  useEffect(() => {
    if (!session?.user) return;

    setIsPublic(session.user.isPublic);
  }, [session]);


  const handleUpadateUsername: SubmitHandler<UpdateUsernameForm> = async (data) => {
    try {
      const response = await fetch('/api/v1/users/profile/username', {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username.replaceAll(' ', '_'),
        }),
      });


      if (response.status === 204) {
        setMessageGlobal({
          title: 'Nome de usuário alterado!',
          text: 'Seu nome de usuário foi alterado com sucesso!',
          type: 'success'
        });
        if (session?.user) {
          session.user.username = data.username;
        }
        return;
      }

      if (response.status >= 400) {
        const responseBody = await response.json();
        if (response.status === 400) {
          if (responseBody.errors) {
            const errors = responseBody.errors;

            errors.forEach((error: any) => {
              setError(error.path[0], { message: error.message });
            });
            return;
          }

          setMessageGlobal({
            type: 'warning',
            title: 'Bad Request',
            text: responseBody.message,
          });
          return;
        }

        if (response.status === 401) {
          setMessageGlobal({
            type: 'danger',
            title: 'Erro',
            text: responseBody.message,
          });
          return;
        }

        if (response.status === 403) {
          setMessageGlobal({
            type: 'danger',
            title: 'Erro',
            text: responseBody.message,
          });
          return;
        }
      }

    } catch (error) {
      setMessageGlobal({
        text: 'Não foi possível se conectar ao Hábitos. Por favor, verifique sua conexão.',
        title: 'Erro',
        type: 'danger'
      });
    }
  }

  function clearErrors() {
    setMessageGlobal(null);
  }

  function onCloseSlideOver() {
    close();
    clearErrors();
  }

  async function handleEnableOrDisableProfile(checked: boolean) {
    try {
      setLoading(true);
      const url = checked ? '/api/v1/users/profile/enabled' : '/api/v1/users/profile/disabled';

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 204) {
        setMessageGlobal({
          title: 'Perfil alterado!',
          text: `Seu perfil foi colocado em modo ${checked ? 'público' : 'oculto'}!`,
          type: 'success'
        });
        setIsPublic(checked);
        setLoading(false);
        if (session?.user) {
          session.user.isPublic = checked;
        }
        return;
      }

      if (response.status === 401) {
        const responseBody = await response.json();
        setMessageGlobal({
          type: 'danger',
          title: 'Erro',
          text: responseBody.message,
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      setMessageGlobal({
        text: 'Não foi possível se conectar ao Hábitos. Por favor, verifique sua conexão.',
        title: 'Erro',
        type: 'danger'
      });
      setLoading(false);
    }
  }
  return (
    <SideOvers title='Configurações' open={open} onClose={onCloseSlideOver}>
      <div className="relative mt-6 flex-1 px-4 sm:px-6">
        <div className="mx-auto mb-0 mt-8 max-w-md space-y-4 border-b border-zinc-700/10 pb-6">
          {messageGlobal && (
            <Alert {...messageGlobal} />
          )}
          <Form.Field>
            <Form.Label>Perfil</Form.Label>

            <div className="flex gap-4">
              <p className="font-bold text-zinc-400">Tornar público?</p>
              <Switch
                disabled={loading}
                checked={isPublic}
                onChange={checked => handleEnableOrDisableProfile(checked)}
                className={clsx('relative inline-flex h-6 w-11 items-center rounded-full disabled:cursor-not-allowed', {
                  'bg-brand-green': isPublic,
                  'bg-zinc-700': !isPublic,
                })}
              >
                <span className="sr-only">Enable/disable public profile</span>
                <span
                  className={clsx('inline-block h-4 w-4 transform rounded-full bg-zinc-900 transition', {
                    'translate-x-6': isPublic,
                    'translate-x-1': !isPublic
                  })}
                />
              </Switch>
              {loading && (
                <CircleNotch size={25} className="animate-spin" />
              )}
            </div>
          </Form.Field>
        </div>
        <FormProvider {...updateUsernameForm}>
          <form onSubmit={handleSubmit(handleUpadateUsername)} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <Form.Field>
              <Form.Label htmlFor="username">
                Nome de usuário
              </Form.Label>
              <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between p-3 border border-zinc-800/90 rounded-lg border-dashed select-none">
                <p className="text-zinc-500 dark:text-zinc-400 truncate w-72 md:w-full">{process.env.NEXT_PUBLIC_URL}/{session?.user.username}</p>
                <CopyUrl url={`${process.env.NEXT_PUBLIC_URL}/me/${session?.user.username}`} />
              </div>
              <Form.ErrorMessage field="username" />
              <Form.Input
                type='text'
                onChange={clearErrors}
                name="username"
                defaultValue={session?.user.username ?? ''}
                placeholder="Digite um nome de usuário"
              />
            </Form.Field>

            <Form.Field>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                type='submit'
                size='lg'>Atualizar</Button>
            </Form.Field>
          </form>
        </FormProvider>
      </div>
    </SideOvers>
  );
}
