import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { LoadingPage } from '../../../components/LoadingPage';
import { Summary } from '../../../components/Summary';
import { api } from '../../../libs/axios';

export type SummaryItem = {
  id: string;
  date: Date;
  completed: number;
  amount: number;
};

export default function SummaryCalendar() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    if (id) {
      const loadingSummary = () => {
        setLoading(true);
        api.get(`/summary/${id}`).then(res => {
          setSummary(res.data.summary);
          setLoading(false);
        });
      };

      loadingSummary();
    }
  }, [id]);

  return (
    <Layout>
      {loading ? <LoadingPage /> : <Summary id={id} data={summary} />}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
  },
});
