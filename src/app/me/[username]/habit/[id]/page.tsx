import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSummary } from '@/app/actions/getSummary';
import { getHabit } from '@/app/actions/getHabit';
import { SummaryList } from '@/components/Summary';
import { HeaderMe } from '@/components/HeaderMe';
import { CopyUrl } from '@/components/Settings/CopyUrl';
import { getUserById } from '@/app/actions/getUserById';

type MeSummaryPropsPage = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: MeSummaryPropsPage): Promise<Metadata> {
  const habit = await getHabit(params.id);

  return {
    title: `${habit?.title} | Sumário`,
    description: `Veja a linha do tempo de ${habit?.title} e acompanhe seu progresso.`,
  };
}

export default async function Summary({ params }: MeSummaryPropsPage) {
  const summary = (await getSummary(params.id)) ?? [];

  if (!summary) {
    notFound();
  }

  const habit = await getHabit(params.id);

  if (!habit) {
    notFound();
  }

  const user = await getUserById(habit.userId);

  if (!user) notFound();

  const copyUrl = `${process.env.NEXT_PUBLIC_URL}/me/${user.username}/habit/${habit.id}`;

  return (
    <main className="w-full pt-16">
      <div className="max-w-screen-2xl mx-auto mt-5 mb-6">
        <HeaderMe title={habit.title} back>
          <CopyUrl url={copyUrl} />
        </HeaderMe>
        <SummaryList summary={summary} habit={habit} />
      </div>
    </main>
  );
}
