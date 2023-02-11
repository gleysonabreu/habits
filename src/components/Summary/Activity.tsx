import classNames from 'classnames';

type ActivityProps = {
  completed: number;
};

export function Activity({ completed }: ActivityProps) {
  return (
    <div
      className={classNames('lg:w-10 lg:h-10 w-8 h-8 border-2 rounded-lg', {
        'bg-zinc-900 border-zinc-800': completed === 0,
        'bg-blue-900 border-blue-500': completed > 0 && completed < 5,
        'bg-blue-800 border-blue-500': completed >= 5 && completed < 10,
        'bg-blue-700 border-blue-500': completed >= 10 && completed < 15,
        'bg-blue-600 border-blue-500': completed >= 15 && completed < 20,
        'bg-blue-500 border-blue-400': completed >= 20,
      })}
    />
  );
}
