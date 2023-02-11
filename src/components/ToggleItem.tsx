import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ToggleGroupItem } from '@radix-ui/react-toggle-group';
import classNames from 'classnames';
import { Check } from 'phosphor-react';
import { ComponentProps } from 'react';

type ToggleItemProps = ComponentProps<typeof ToggleGroupItem> & {
  isChecked: boolean;
};

export function ToggleItem({ value, isChecked, ...props }: ToggleItemProps) {
  return (
    <ToggleGroup.Item
      value={value}
      {...props}
      className={classNames(
        'focus:outline-none focus:ring-2 ring-opacity-40 ring-gray-950 w-8 h-8 rounded-md border flex items-center justify-center',
        {
          'bg-green-600 border-green-600': isChecked === true,
          'bg-zinc-800 border-zinc-800': isChecked === false,
        },
      )}
    >
      {isChecked === true && <Check size={20} />}
    </ToggleGroup.Item>
  );
}
