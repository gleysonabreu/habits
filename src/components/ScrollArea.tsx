import * as ScrollAreaContainer from '@radix-ui/react-scroll-area';
import { ReactNode } from 'react';

type ScrollAreaProps = {
  children: ReactNode;
};

export function ScrollArea({ children }: ScrollAreaProps) {
  return (
    <ScrollAreaContainer.Root className={`w-full rounded overflow-hidden`}>
      <ScrollAreaContainer.Viewport className="w-full h-full rounded-none">
        {children}
      </ScrollAreaContainer.Viewport>
      <ScrollAreaContainer.Scrollbar
        className="flex select-none touch-none p-[2px] bg-gray-800 rounded-lg transition-colors ease-out hover:bg-gray-700 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="vertical"
      >
        <ScrollAreaContainer.Thumb className="ScrollAreaThumb" />
      </ScrollAreaContainer.Scrollbar>
      <ScrollAreaContainer.Scrollbar
        className="flex select-none touch-none p-[2px] bg-gray-800 rounded-lg transition-colors ease-out hover:bg-gray-700 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="horizontal"
      >
        <ScrollAreaContainer.Thumb className="ScrollAreaThumb" />
      </ScrollAreaContainer.Scrollbar>
      <ScrollAreaContainer.Corner className="bg-gray-800" />
    </ScrollAreaContainer.Root>
  );
}
