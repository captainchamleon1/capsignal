"use client";

import { Panel } from "@/components/ui/panel";
import { RevealStagger } from "@/components/ui/reveal";

type Layer = {
  title: string;
  items: readonly string[];
};

export function PlatformSignalsAnimated({ layers }: { layers: readonly Layer[] }) {
  return (
    <RevealStagger
      stagger={90}
      direction="scale"
      className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
    >
      {layers.map((layer) => (
        <Panel key={layer.title} padding="sm" className="reveal-stagger-item border-0">
          <h3 className="text-sm font-semibold text-text-primary">{layer.title}</h3>
          <ul className="mt-3 space-y-2">
            {layer.items.map((item) => (
              <li key={item} className="text-sm text-text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </RevealStagger>
  );
}
