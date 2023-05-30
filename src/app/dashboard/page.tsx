import { Card } from '@/components/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { HeaderSection } from '@/components/HeaderSection';
import { getHabits } from '../actions/getHabits';
import { DeleteHabit } from '@/components/DeleteHabit';

export const metadata = { title: 'Hábitos | Dashboard' };

export type Habit = {
  id: string;
  title: string;
  createdAt: Date;
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/?callbackUrl=/dashboard');
  }

  const habits = (await getHabits(session.user.id)) ?? [];

  return (
    <main className="w-full pt-10">
      <div className="max-w-screen-2xl mx-auto mt-10 mb-6 min-h-[500px]">
        <HeaderSection />

        {habits.length === 0 ? (
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
              Nenhum hábito encontrado!
            </h1>
          </div>
        ) : (
          <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                url={`/dashboard/habit/${habit.id}`}
                title={habit.title}
                date={habit.createdAt}
              >
                <DeleteHabit id={habit.id} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
