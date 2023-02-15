import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitsProvider } from '../contexts/HabitsContext';
import '../libs/dayjs';
import '../styles/main.css';

nProgress.configure({ showSpinner: false });

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    const handleRouteStart = () => nProgress.start();
    const handleRouteDone = () => nProgress.done();

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
      <HabitsProvider>
        <Component {...pageProps} />
      </HabitsProvider>
      <ToastContainer />
    </SessionProvider>
  );
}

export default appWithTranslation(App);
