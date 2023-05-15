export default function Loading() {
  return (
    <main className="w-full pt-10">
      <div className="max-w-screen-2xl mx-auto mt-10 mb-6 min-h-[500px]">
        <header>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div className="text-center sm:text-left w-full">
                <div className="w-full max-w-md bg-zinc-200 dark:bg-zinc-900 animate-pulse h-9 rounded-xl" />
                <div className="mt-1.5 bg-zinc-200 dark:bg-zinc-900 animate-pulse rounded-xl h-5 w-full max-w-xs" />
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                <div className="h-12 py-0 px-8 bg-zinc-200 dark:bg-zinc-900 w-full rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
          {[...Array(5).keys()].map(i => (
            <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-900 p-1 animate-pulse">
              <div className="block rounded-xl h-64  p-4 sm:p-6 lg:p-8" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
