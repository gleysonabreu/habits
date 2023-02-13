import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { Summary } from '../../../components/Summary';

export default function SummaryCalendar() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Layout>
      <Summary id={id} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
  },
});
