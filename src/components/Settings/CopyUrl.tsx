'use client';

import { Check, Copy } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

type CopyUrlProps = {
  url: string;
};

export function CopyUrl({ url }: CopyUrlProps) {
  const [isCopied, setIsCopied] = useState(false);

  function handleCopyUrl() {
    setIsCopied(true);
    navigator.clipboard.writeText(url);
  }

  useEffect(() => {
    const timeCopied = setTimeout(() => setIsCopied(false), 5000);

    return () => clearTimeout(timeCopied);
  }, [isCopied]);

  return (
    <button
      title="Copiar?"
      onClick={handleCopyUrl}
      type="button"
      className="text-brand-primary hover:text-brand-secondary transition-all"
    >
      {isCopied ? <Check size={25} /> : <Copy size={25} />}
    </button>
  );
}
