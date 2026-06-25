type StatItem = {
  value: string;
  label: string;
  detail?: string;
};

type StatGridProps = {
  items: readonly StatItem[];
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StatGrid({ items, columns = 4 }: StatGridProps) {
  return (
    <dl className={`grid grid-cols-2 gap-px border border-border bg-border ${columnClasses[columns]}`}>
      {items.map((item) => (
        <div key={item.label} className="bg-surface-elevated px-5 py-5 md:px-6 md:py-6">
          <dt className="font-mono text-xl font-medium tabular-nums tracking-tight text-text-primary md:text-2xl">
            {item.value}
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-text-primary">{item.label}</dd>
          {item.detail && (
            <dd className="mt-2 text-xs leading-relaxed text-text-secondary">{item.detail}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}
