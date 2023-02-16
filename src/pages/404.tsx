import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/Button';
import custom404Image from '../styles/images/black-hole.svg';
import logoSVG from '../styles/images/logo.svg';

export default function Custom404() {
  const { t: translate } = useTranslation('common');

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-between w-[1019px]">
        <div className="lg:w-[unset] w-64">
          <Image src={custom404Image} alt="404" />
        </div>
        <div className="flex flex-col mt-16 lg:mt-0 justify-center gap-5 items-center lg:items-start">
          <Image src={logoSVG} alt="Habits Brand" />
          <h1 className="text-7xl font-bold text-brand-blue-mid leading-tight">
            404
          </h1>
          <div className="flex flex-col gap-2 items-center lg:items-start">
            <h1 className="text-gray-100 text-2xl">
              {translate('pages.404.title')}
            </h1>
            <p className="text-gray-300">{translate('pages.404.subtitle')}</p>
            <Button size="lg" isFull variant="blue" asChild>
              <Link href="/" className="uppercase">
                {translate('pages.404.button')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en-US', ['common'])),
  },
});
