'use client';
import { CircleNotch } from '@phosphor-icons/react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'white' | 'purple' | 'sky' | 'red' | 'brand';
  isFull?: boolean;
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  children,
  variant = 'white',
  isFull,
  asChild,
  size = 'md',
  disabled = false,
  loading = false,
  ...rest
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      {...rest}
      disabled={disabled}
      className={clsx(
        'flex group items-center justify-center gap-2 rounded-xl border-4 border-black font-bold transition shadow-[6px_6px_0_0_#000] hover:shadow-none focus:outline-none focus:ring focus:shadow-none',
        {
          'bg-white text-zinc-800 active:bg-white focus:ring-white':
            variant === 'white',
          'text-blue-100 bg-brand-primary rounded-full active:bg-brand-primary focus:ring-brand-primary':
            variant === 'brand',
          'bg-red-600 text-red-100 active:bg-red focus:ring-red-600':
            variant === 'red',
          'bg-purple-600 text-zinc-100 active:bg-purple-600 focus:ring-purple-600':
            variant === 'purple',
          'bg-sky-600 text-zinc-100 active:bg-sky-600 focus:ring-sky-600':
            variant === 'sky',
          'w-full': isFull === true,
          'h-8 py-0 px-4 text-xs': size === 'sm',
          'h-10 py-0 px-6 text-sm': size === 'md',
          'h-12 py-0 px-8 text-sm': size === 'lg',
          'px-8 py-4': size === 'xl',
          'disabled:cursor-not-allowed disabled:hover:shadow-[6px_6px_0_0_#000] disabled:opacity-70':
            disabled === true,
        },
      )}
    >
      {loading ? <CircleNotch size={25} className="animate-spin" /> : children}
    </Component>
  );
}
