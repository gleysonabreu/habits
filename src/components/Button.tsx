import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { CircleNotch } from 'phosphor-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant: 'blue' | 'black' | 'green' | 'red' | 'purple';
  size: 'sm' | 'md' | 'lg';
  isFull?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  isLoading?: boolean;
};

export function Button({
  children,
  variant,
  size,
  isFull,
  disabled,
  asChild,
  isLoading,
  ...rest
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={classNames(
        'group flex items-center justify-center gap-2 border rounded-md transition-all font-bold disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 ring-opacity-40',
        {
          'border-brand-blue-mid hover:bg-brand-blue-mid text-gray-100 ring-brand-blue-light':
            variant === 'blue',
          'border-green-600 hover:bg-green-600 text-gray-100 ring-green-500':
            variant === 'green',
          'border-gray-700 hover:bg-gray-700 text-gray-100 ring-gray-500':
            variant === 'black',
          'border-red-700 hover:bg-red-700 text-red-100 ring-red-500':
            variant === 'red',
          'border-purple-700 hover:bg-purple-700 text-purple-100 ring-purple-500':
            variant === 'purple',
          'h-8 px-4 py-0 text-sm': size === 'sm',
          'h-10 px-5 py-0 text-sm': size === 'md',
          'h-12 px-8 py-0 text-sm': size === 'lg',
          'w-full': isFull === true,
        },
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <CircleNotch size={20} className="animate-spin" />
      ) : (
        children
      )}
    </Component>
  );
}
