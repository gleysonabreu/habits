import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingPage } from '../components/LoadingPage';
import { HabitsProvider } from '../contexts/HabitsContext';
import '../libs/dayjs';
import '../styles/main.css';

dayjs.extend(isoWeek);

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleRouteStart = () => setLoading(true);
    const handleRouteDone = () => setLoading(false);

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);
  return (
    <SessionProvider session={session}>
      {loading ? (
        <LoadingPage />
      ) : (
        <HabitsProvider>
          <Component {...pageProps} />
        </HabitsProvider>
      )}
      <ToastContainer />
    </SessionProvider>
  );
}

export default appWithTranslation(App);
