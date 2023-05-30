import { getHabits } from '@/app/actions/getHabits';
import { getUserByUsername } from '@/app/actions/getUserByUsername';
import { CopyUrl } from '@/components/Settings/CopyUrl';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';

type MePropsPage = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: MePropsPage): Promise<Metadata> {
  const user = await getUserByUsername(params.username);

  return {
    title: `Hábitos | ${user?.name}(@${user?.username})`,
    description: `Veja o perfil de ${user?.name} e acompanhe seu progresso.`,
  };
}

export default async function Me({ params }: MePropsPage) {
  const user = await getUserByUsername(params.username);

  if (!user) notFound();

  if (!user.isPublic) notFound();

  const URL = `${process.env.NEXT_PUBLIC_URL}/me/${user.username}`;

  const habits = (await getHabits(user.id)) ?? [];

  return (
    <main className="w-full pt-10">
      <div className="max-w-screen-2xl mx-auto p-4 mt-10 mb-6 min-h-[500px]">
        <div className="w-full bg-zinc-200 dark:bg-zinc-900 max-w-xl rounded-2xl p-4 flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              alt="Picture"
              className="rounded-full"
              width={100}
              height={100}
              src={user.image ?? '/default-avatar.svg'}
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <h2 className="text-zinc-500 dark:text-zinc-400">
                @{user.username}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 border border-zinc-800/90 rounded-lg border-dashed select-none">
            <CopyUrl url={URL} />
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="flex items-center justify-center mt-10">
            <h1 className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
              Nenhum hábito encontrado!
            </h1>
          </div>
        ) : (
          <div className="w-full mt-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                url={`${URL}/habit/${habit.id}`}
                title={habit.title}
                date={habit.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
