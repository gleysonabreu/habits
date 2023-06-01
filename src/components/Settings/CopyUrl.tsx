'use client';
import { Check, Copy } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from '../Button';

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
    <Button
      title="Compartilhar?"
      size="lg"
      variant="brand"
      type="button"
      onClick={handleCopyUrl}
    >
      <span className="block">Compartilhar</span>
      {isCopied ? (
        <Check
          size={16}
          className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5"
        />
      ) : (
        <Copy
          size={16}
          className="block ml-1 transition duration-200 transform group-hover:translate-x-0.5"
        />
      )}
    </Button>
  );
}
