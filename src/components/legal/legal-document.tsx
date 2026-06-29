import Link from "next/link";
import type { LegalDocument as LegalDocumentType } from "@/lib/content/legal";

type LegalDocumentProps = {
  document: LegalDocumentType;
};

export function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <article className="prose-content mx-auto max-w-(--width-reading)">
      <p className="font-mono text-[11px] text-text-tertiary">
        Last updated: {document.lastUpdated}
      </p>

      {document.intro ? <p>{document.intro}</p> : null}

      {document.sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.afterList?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </section>
      ))}

      {document.contactNote ? (
        <p className="mt-8 border-t border-border pt-6 text-sm">
          {document.contactNote.split(/([\w.+-]+@[\w.-]+\.\w+)/).map((part, i) =>
            /^[\w.+-]+@[\w.-]+\.\w+$/.test(part) ? (
              <a key={i} href={`mailto:${part}`}>
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>
      ) : null}

      <p className="text-sm">
        See also:{" "}
        <Link href="/legal">Legal overview</Link>
        {" · "}
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/terms">Terms</Link>
        {" · "}
        <Link href="/cookies">Cookies</Link>
        {" · "}
        <Link href="/security">Security</Link>
      </p>
    </article>
  );
}
