'use client';
import Link from "next/link";
import { Logo } from "./Logo";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, Switch, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { SideOvers } from "./SideOvers";
import { Form } from "./Form";
import { Alert, AlertProps } from "./Alert";
import clsx from "clsx";
import { CircleNotch } from "@phosphor-icons/react";

type MessageProps = AlertProps;

export function Header() {
  const { data: session } = useSession();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageGlobal, setMessageGlobal] = useState<MessageProps | null>(null);


  useEffect(() => {
    if (!session?.user) return;

    setIsPublic(session.user.isPublic);
  }, [session]);


  function onCloseSlideOver(state: boolean) {
    setSlideOverOpen(state);
    setMessageGlobal(null);
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
    <div className="fixed inset-0 z-40 h-16 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 w-full">
      <div className="relative z-index px-4 mx-auto max-w-screen-2xl">
        <div className="relative z-10 flex items-center justify-between w-full h-16 px-4">
          <Link href="/dashboard" className="flex items-center h-16 hover:opacity-80">
            <p className="sr-only">hábitos</p>
            <div className="flex items-center w-40 h-16">
              <Logo />
            </div>
          </Link>

          {session && (
            <Menu as='div' className="relative">
              <div>
                <span className="sr-only">Open user menu</span>
                <Menu.Button className='flex max-w-xs items-center rounded-full dark:bg-zinc-800 bg-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-800 focus:ring-offset-zinc-100'>
                  <Image src={session.user.image ?? '/default-avatar.svg'} alt='Foto do usuário' width={40} height={40} className="rounded-full" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-100 dark:bg-zinc-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    <button
                      onClick={() => setSlideOverOpen(true)}
                      className='block px-4 py-2 text-sm text-zinc-400 dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-600'
                    >
                      Configurações
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      className='block px-4 py-2 text-sm text-zinc-400 dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-600'
                      onClick={() => signOut()}
                    >
                      Sair
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>

      <SideOvers title='Configurações' open={slideOverOpen} onClose={onCloseSlideOver}>
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
        </div>
      </SideOvers>
    </div>
  );
}
