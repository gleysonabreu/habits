'use client';

import { Copy } from "@phosphor-icons/react";

type CopyUrlProps = {
  url: string;
}

export function CopyUrl({ url }: CopyUrlProps) {
  function handleCopyUrl() {
    navigator.clipboard.writeText(url);
  }

  return (
    <button onClick={handleCopyUrl} type='button' className="text-brand-primary hover:text-brand-secondary transition-all">
      <Copy size={25} />
    </button>
  );
}
