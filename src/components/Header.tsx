'use client';
import Link from "next/link";
import { Logo } from "./Logo";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react'

export function Header() {

  const { data: session } = useSession();

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
                    <Link
                      href='/'
                      className='block px-4 py-2 text-sm text-zinc-400 dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-600'
                    >
                      Configurações
                    </Link>
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
    </div>
  );
}
