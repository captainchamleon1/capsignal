import { comparisonRows } from "@/lib/content/home";
import { Container } from "@/components/ui/container";

export function Comparison() {
  return (
    <section className="border-t border-border py-(--spacing-section)">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
            Not a CRM. Not a spreadsheet.
          </h2>
          <p className="mt-3 text-base text-text-secondary">
            CapSignal is fundraising execution—targeting, outreach, and follow-up
            built for raises, not general sales.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-4 py-3 text-left font-medium text-text-tertiary" />
                <th className="px-4 py-3 text-left font-medium text-text-tertiary">Manual</th>
                <th className="px-4 py-3 text-left font-medium text-text-tertiary">CRM</th>
                <th className="px-4 py-3 text-left font-medium text-text-primary">CapSignal</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.feature}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.manual}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.crm}</td>
                  <td className="px-4 py-3 text-text-primary">{row.capsignal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
