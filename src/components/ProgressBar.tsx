export function ProgressBar({ sold, total }: { sold: number; total: number }) {
  const pct = Math.round((sold / total) * 100);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg font-semibold text-foreground">
          {sold} <span className="text-muted-foreground">/ {total}</span> números vendidos
        </p>
        <p className="text-sm font-semibold text-primary">{pct}%</p>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-blush">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
