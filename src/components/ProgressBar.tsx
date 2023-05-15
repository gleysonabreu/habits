import * as Progress from '@radix-ui/react-progress';

type ProgressBarProps = {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <Progress.Root
      value={100}
      className="relative overflow-hidden bg-zinc-300 dark:bg-zinc-900 rounded-full w-80 h-3"
      style={{
        translate: 'translateZ(0)',
      }}
    >
      <Progress.Indicator
        className="bg-brand-green w-full h-full"
        style={{
          transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
          transform: `translateX(-${100 - progress}%)`,
        }}
      />
    </Progress.Root>
  );
}
