import type { DataConnector } from "@/lib/data/types";

export abstract class BaseConnector implements DataConnector {
  abstract key: string;
  abstract name: string;
  abstract description: string;
  abstract priority: number;
  abstract fetch(options?: { limit?: number; since?: Date }): Promise<import("@/lib/data/types").ConnectorResult[]>;

  protected async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: {
        "User-Agent": "CapSignal Data Pipeline (contact@getcapsignal.com)",
        Accept: "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`${this.key}: HTTP ${res.status} for ${url}`);
    }
    return res.json() as Promise<T>;
  }

  protected slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }
}
