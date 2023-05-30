import { HtmlHTMLAttributes } from 'react';

type FieldProps = HtmlHTMLAttributes<HTMLDivElement> & {};

export function Field(props: FieldProps) {
  return <div className="flex flex-col gap-3" {...props} />;
}
