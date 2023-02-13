import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { Summary } from '../../../components/Summary';
import { authOptions } from '../../api/auth/[...nextauth]';

export default function SummaryCalendar() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Layout>
      <Summary id={id} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { locale, req, res } = context;
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
    },
  };
};
