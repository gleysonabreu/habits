import { LabelHTMLAttributes } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {};

export function Label(props: LabelProps) {
  return (
    <label
      className="text-md text-zinc-800 dark:text-zinc-100 font-medium"
      {...props}
    />
  );
}
