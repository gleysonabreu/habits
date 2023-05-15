import { Check } from '@phosphor-icons/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ToggleGroupItem } from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { ComponentProps } from 'react';

type ToggleItemProps = ComponentProps<typeof ToggleGroupItem> & {
  isChecked: boolean;
};

export function ToggleItem({ value, isChecked, ...props }: ToggleItemProps) {
  return (
    <ToggleGroup.Item
      {...props}
      value={value}
      className={clsx('w-8 h-8 rounded-xl border-2 focus:ring-2 focus:ring-brand-primary flex items-center justify-center', {
        'bg-brand-green border-green-200': isChecked,
        ' bg-zinc-300 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-800': !isChecked,
      })}
    >
      {isChecked && <Check size={20} />}

    </ToggleGroup.Item>
  );
}
