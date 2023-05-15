import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { HeaderHabitDetails } from '@/components/HeaderHabitDetails';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSummary } from '@/app/actions/getSummary';
import { getHabit } from '@/app/actions/getHabit';
import { SummaryList } from '@/components/Summary';


type SummaryPropsPage = {
  params: {
    id: string;
  }
}

export async function generateMetadata({ params }: SummaryPropsPage): Promise<Metadata> {
  const habit = await getHabit(params.id);

  return {
    title: `${habit?.title} | Sumário`,
    description: `Veja a linha do tempo de ${habit?.title} e acompanhe seu progresso.`,
  }
}

export default async function Summary({ params }: SummaryPropsPage) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/?callbackUrl=/dashboard/habit/${params.id}`);
  }

  const summary = await getSummary(params.id) ?? [];

  if (!summary) {
    notFound();
  }

  const habit = await getHabit(params.id);

  if (!habit) {
    notFound();
  }

  return (
    <main className="w-full pt-16">
      <div className="max-w-screen-2xl mx-auto mt-5 mb-6">
        <HeaderHabitDetails title={habit.title} habitId={habit.id} />
        <SummaryList summary={summary} habit={habit} />
      </div>
    </main>
  );
}
