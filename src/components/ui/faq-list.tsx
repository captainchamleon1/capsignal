type FaqItem = { q: string; a: string };

export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {items.map((faq) => (
        <div key={faq.q} className="py-6 first:pt-6 last:pb-6">
          <dt className="text-[15px] font-medium leading-snug text-text-primary">{faq.q}</dt>
          <dd className="mt-2.5 text-sm leading-relaxed text-text-secondary">{faq.a}</dd>
        </div>
      ))}
    </dl>
  );
}
