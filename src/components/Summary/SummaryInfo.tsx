export function SummaryInfo() {
  return (
    <div className="flex gap-1 p-2 items-center">
      <p className="text-sm text-zinc-400 dark:text-zinc-500">Menos</p>
      <div className="h-5 w-5 rounded-md border-2 bg-zinc-300 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-900" />
      <div className="h-5 w-5 rounded-md border-2 bg-blue-500 border-blue-400" />
      <div className="h-5 w-5 rounded-md border-2 bg-blue-600 border-blue-500" />
      <div className="h-5 w-5 rounded-md border-2 bg-blue-700 border-blue-500" />
      <div className="h-5 w-5 rounded-md border-2 bg-blue-800 border-blue-500" />
      <div className="h-5 w-5 rounded-md border-2 bg-blue-900 border-blue-500" />
      <p className="text-sm text-zinc-400 dark:text-zinc-500">Mais</p>
    </div>
  );
}
