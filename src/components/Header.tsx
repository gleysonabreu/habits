import { Disclosure, Transition } from '@headlessui/react';
import * as DialogContent from '@radix-ui/react-dialog';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, Plus, SignOut, X } from 'phosphor-react';
import { Fragment } from 'react';
import logo from '../styles/images/logo.svg';
import { Button } from './Button';
import { CreateHabitDialog } from './CreateHabitDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { Languages } from './Languages';

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const { t: translate } = useTranslation('common');

  const menus = [
    {
      name: translate('header_dashboard.menu.dashboard'),
      href: '/dashboard',
    },
    {
      name: translate('header_dashboard.menu.account'),
      href: '/dashboard/account',
    },
  ];

  return (
    <Disclosure
      as="header"
      className="w-full lg:h-[94px] flex flex-col bg-gray-900 shadow-header p-3 transition-all relative"
    >
      {({ open }) => (
        <>
          <div className="w-full flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="Habits Brand" width={120} />
            </Link>

            <nav className="hidden lg:flex">
              <ul className="w-[unset] h-full flex overflow-auto list-none flex-row items-center justify-center m-[unset] gap-4">
                {menus.map((menu, index) => (
                  <li
                    key={index}
                    className="mt-[unset] h-full flex items-center min-h-[60px]"
                  >
                    <Link
                      href={menu.href}
                      className={classNames(
                        'hover:text-gray-200 hover:border-brand-blue-mid py-7 px-0 h-full flex items-center transition-all ease-in border-b-2',
                        {
                          'border-brand-blue-mid text-gray-100 font-bold':
                            router.pathname === menu.href,
                          'border-transparent text-gray-400':
                            router.pathname !== menu.href,
                        },
                      )}
                    >
                      {menu.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:flex gap-2 items-center">
              <Languages />
              {router.pathname === '/dashboard/habit/[id]' ? (
                <DialogContent.Root>
                  <Button variant="blue" size="md" asChild>
                    <DialogContent.Trigger>
                      <Plus size={20} />
                      {translate('header_dashboard.new_task')}
                    </DialogContent.Trigger>
                  </Button>

                  <CreateTaskDialog />
                </DialogContent.Root>
              ) : (
                <DialogContent.Root>
                  <Button variant="blue" size="md" asChild>
                    <DialogContent.Trigger>
                      <Plus size={20} />
                      {translate('header_dashboard.new_habit')}
                    </DialogContent.Trigger>
                  </Button>

                  <CreateHabitDialog />
                </DialogContent.Root>
              )}
              <Button variant="blue" size="md" onClick={() => signOut()}>
                <SignOut size={20} />
                {translate('header_dashboard.logout')}
              </Button>
              <Image
                alt="Avatar"
                src={session?.user?.image || '/avatar.svg'}
                className="rounded-full border-2 border-brand-blue-mid"
                width={45}
                height={45}
              />
            </div>

            <div className="flex lg:hidden">
              <Button size="md" variant="black" asChild>
                <Disclosure.Button>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <List className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </Button>
            </div>
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
            <Disclosure.Panel className="lg:hidden">
              <div className="pt-4 pb-3">
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-2 items-center bg-brand-blue-low border border-brand-blue-dark h-11 rounded-full p-3">
                    <Image
                      alt="Avatar"
                      src={session?.user?.image || '/avatar.svg'}
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    <h1>{session?.user.name}</h1>
                  </div>

                  <nav className="flex">
                    <ul className="w-[unset] h-full flex overflow-auto list-none flex-col items-center justify-center m-[unset] gap-4">
                      {menus.map((menu, index) => (
                        <li
                          key={index}
                          className="mt-[unset] flex items-center"
                        >
                          <Link
                            href={menu.href}
                            className={classNames(
                              'hover:text-gray-200 hover:border-brand-blue-mid px-0 h-full flex items-center transition-all ease-in border-b-2',
                              {
                                'border-brand-blue-mid text-gray-100 font-bold':
                                  router.pathname === menu.href,
                                'border-transparent text-gray-400':
                                  router.pathname !== menu.href,
                              },
                            )}
                          >
                            {menu.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {router.pathname === '/dashboard/habit/[id]' ? (
                    <DialogContent.Root>
                      <Button variant="blue" size="md" asChild>
                        <DialogContent.Trigger>
                          <Plus size={20} />
                          {translate('header_dashboard.new_task')}
                        </DialogContent.Trigger>
                      </Button>

                      <CreateTaskDialog />
                    </DialogContent.Root>
                  ) : (
                    <DialogContent.Root>
                      <Button variant="blue" size="md" asChild>
                        <DialogContent.Trigger>
                          <Plus size={20} />
                          {translate('header_dashboard.new_habit')}
                        </DialogContent.Trigger>
                      </Button>

                      <CreateHabitDialog />
                    </DialogContent.Root>
                  )}
                  <Button variant="blue" size="md" onClick={() => signOut()}>
                    <SignOut size={20} />
                    {translate('header_dashboard.logout')}
                  </Button>
                  <Languages />
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
