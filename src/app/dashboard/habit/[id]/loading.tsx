import { generateDates } from '@/utils/generate-dates';

const summaryDates = generateDates();

export default function Loading() {
  return (
    <main className="w-full pt-16">
      <div className="max-w-screen-2xl mx-auto mt-5 mb-6">
        <header>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div className="text-center sm:text-left w-full">
                <div className="w-full max-w-md bg-zinc-200 dark:bg-zinc-900 animate-pulse h-9 rounded-xl" />
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                <div className="h-12 py-0 px-8 bg-zinc-200 dark:bg-zinc-900 w-full rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </header>
        <div className="w-full flex flex-col lg:flex-row gap-3 items-center justify-center">
          <div className="grid grid-cols-7 lg:grid-cols-none lg:grid-rows-7 grid-flow-col lg:grid-flow-row gap-1">
            {[...Array(7).keys()].map((i) => (
              <div
                key={i}
                className="animate-pulse h-10 w-10 lg:h-5 lg:w-5 rounded-xl lg:rounded-md lg:text-xs font-bold flex items-center justify-center text-zinc-100 bg-brand-primary"
              >
                <p className="sr-only">week day</p>
              </div>
            ))}
          </div>

          <div className="grid grid-flow-row lg:grid-flow-col grid-cols-7 lg:grid-cols-none lg:grid-rows-7 gap-1">
            {summaryDates.map((date) => (
              <div
                key={date.toString()}
                className="animate-pulse h-10 w-10 lg:h-5 lg:w-5 rounded-xl lg:rounded-md bg-zinc-200 dark:bg-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-zinc-900 focus:ring-offset-zinc-100 focus:ring-sky-600"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
