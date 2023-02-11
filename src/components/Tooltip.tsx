import * as TooltipContent from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  tooltipTitle: string;
};

export function Tooltip({ children, tooltipTitle }: TooltipProps) {
  return (
    <TooltipContent.Provider>
      <TooltipContent.Root>
        <TooltipContent.Trigger className="rounded-lg focus:outline-none focus:ring-2 ring-opacity-40 ring-zinc-500">
          {children}
        </TooltipContent.Trigger>
        <TooltipContent.Portal>
          <TooltipContent.Content
            className="capitalize TooltipContent"
            sideOffset={5}
          >
            {tooltipTitle}
            <TooltipContent.Arrow className="TooltipArrow" />
          </TooltipContent.Content>
        </TooltipContent.Portal>
      </TooltipContent.Root>
    </TooltipContent.Provider>
  );
}
