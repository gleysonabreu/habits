export function LoadingCheckBox() {
  return (
    <div className="w-full flex gap-3 animate-pulse">
      <div className="h-8 bg-white w-8 rounded-xl bg-zinc-200 dark:bg-zinc-900" />
      <div className="h-8 bg-white w-full rounded-xl bg-zinc-200 dark:bg-zinc-900" />
    </div>
  );
}
