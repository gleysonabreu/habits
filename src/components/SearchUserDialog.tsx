import Image from 'next/image';
import Link from 'next/link';
import { CircleNotch, MagnifyingGlass } from 'phosphor-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { api } from '../libs/axios';
import { Button } from './Button';
import { Dialog } from './Dialog';

type UserProfile = {
  id: string;
  name: string;
  image: string;
  username: string;
};

export function SearchUserDialog() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [noUsers, setNoUsers] = useState({
    show: false,
    message: '',
  });

  const { t: translate } = useTranslation('common');

  async function handleSearchUser() {
    setLoading(true);
    if (username.length < 3) {
      toast.error(translate('messages.username_length'));
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/users`, {
        params: {
          username,
        },
      });

      if (res.data.length === 0) {
        setNoUsers({
          show: true,
          message: username,
        });
      } else {
        setNoUsers({ message: '', show: false });
      }

      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(translate('messages.something_went_wrong'));
      setLoading(false);
    }
  }

  return (
    <Dialog title={translate('search.title')}>
      <div className="mt-8 flex flex-col gap-4">
        <fieldset className="flex flex-col gap-5 mb-3">
          <label className="text-sm text-gray-200 text-left">
            {translate('search.subtitle')}
          </label>
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={translate('search.placeholder_input') as string}
              className="focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 bg-zinc-800 outline-none w-full p-3 border border-zinc-800 flex-1 inline-flex items-center justify-center rounded-md"
            />
            <Button
              variant="blue"
              size="lg"
              onClick={handleSearchUser}
              isLoading={loading}
            >
              {loading ? (
                <CircleNotch className="animate-spin" size={20} />
              ) : (
                <MagnifyingGlass size={20} />
              )}
            </Button>
          </div>
        </fieldset>
      </div>

      <div className="flex w-full px-3 py-0">
        {noUsers.show && (
          <div className="mx-auto py-9 px-0 w-4/5 text-center">
            <div className="pb-3 text-gray-400 flex justify-center items-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 20 20"
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-center"
              >
                <path d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"></path>
              </svg>
            </div>
            <p>
              {translate('search.no_results')}: {noUsers.message}
            </p>
          </div>
        )}

        {users.length > 0 && (
          <div className="max-h-96 overflow-y-auto w-full">
            <ul className="list-none p-3 m-0">
              {users.map(user => (
                <li key={user.id} className="rounded-lg flex pb-2 relative">
                  <Link
                    href={`${user.username}`}
                    className="focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 bg-zinc-800 flex gap-2 w-full rounded-lg p-3 hover:bg-brand-blue-mid"
                  >
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h1>{user.name}</h1>
                      <span className="text-sm font-thin text-zinc-300">
                        @{user.username}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
}
