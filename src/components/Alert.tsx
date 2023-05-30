import clsx from 'clsx';

export type AlertProps = {
  title: string;
  text: string;
  type: 'warning' | 'danger' | 'success' | 'info';
};

export function Alert({ title, text, type }: AlertProps) {
  return (
    <div
      className={clsx('rounded border-s-4 p-4', {
        'dark:border-red-600 dark:bg-red-900 border-red-500 bg-red-50':
          type === 'danger',
        'dark:border-yellow-600 dark:bg-yellow-900 border-yellow-500 bg-yellow-50':
          type === 'warning',
        'dark:border-green-600 dark:bg-green-900 border-green-500 bg-green-50':
          type === 'success',
        'dark:border-blue-600 dark:bg-blue-900 border-blue-500 bg-blue-50':
          type === 'info',
      })}
    >
      <strong
        className={clsx('block font-medium ', {
          'text-red-800 dark:text-red-100': type === 'danger',
          'text-yellow-800 dark:text-yellow-100': type === 'warning',
          'text-green-800 dark:text-green-100': type === 'success',
          'text-blue-800 dark:text-blue-100': type === 'info',
        })}
      >
        {title}
      </strong>

      <p
        className={clsx('mt-2 text-sm', {
          'text-red-700 dark:text-red-200': type === 'danger',
          'text-yellow-700 dark:text-yellow-200': type === 'warning',
          'text-green-700 dark:text-green-200': type === 'success',
          'text-blue-700 dark:text-blue-200': type === 'info',
        })}
      >
        {text}
      </p>
    </div>
  );
}
