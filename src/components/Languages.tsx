import classesNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

type Language = 'en-US' | 'pt-BR';

export function Languages() {
  const router = useRouter();
  const { pathname, query, asPath, locale } = router;

  function handleChangeLanguage(language: Language) {
    router.push({ pathname, query }, asPath, { locale: language });
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="flex items-center gap-1"
        onClick={() => handleChangeLanguage('en-US')}
      >
        <Image
          src="/united-states.png"
          width={32}
          height={32}
          alt="US Flag"
          className={classesNames('border-2 rounded-full', {
            'border-blue-500': locale === 'en-US',
            'border-transparent': locale !== 'en-US',
          })}
        />
        US
      </button>
      <button
        className="flex items-center gap-1"
        onClick={() => handleChangeLanguage('pt-BR')}
      >
        <Image
          src="/brazil.png"
          width={32}
          height={32}
          alt="US Flag"
          className={classesNames('border-2 rounded-full', {
            'border-blue-500': locale === 'pt-BR',
            'border-transparent': locale !== 'pt-BR',
          })}
        />
        BR
      </button>
    </div>
  );
}
