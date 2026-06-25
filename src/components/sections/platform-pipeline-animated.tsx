"use client";

import { dataPipeline } from "@/lib/content/platform";
import { Panel } from "@/components/ui/panel";
import { RevealStagger } from "@/components/ui/reveal";

export function PlatformPipelineAnimated() {
  return (
    <RevealStagger
      stagger={100}
      direction="up"
      className="grid gap-px border border-border bg-border md:grid-cols-4"
    >
      {dataPipeline.map((stage, i) => (
        <Panel key={stage.stage} padding="sm" className="reveal-stagger-item border-0">
          <p className="font-mono text-[10px] tabular-nums text-text-tertiary">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">{stage.stage}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.description}</p>
        </Panel>
      ))}
    </RevealStagger>
  );
}
