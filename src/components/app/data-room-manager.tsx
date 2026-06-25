"use client";

import { useState } from "react";

type Doc = {
  id: string;
  name: string;
  category: string;
  viewCount: number;
  createdAt: string;
};

export function DataRoomManager({
  dataRoomId,
  documents: initial,
}: {
  dataRoomId?: string;
  documents: Doc[];
}) {
  const [documents, setDocuments] = useState(initial);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("deck");
  const [loading, setLoading] = useState(false);

  async function addDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!dataRoomId) return;
    setLoading(true);

    const res = await fetch("/api/data-room/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataRoomId, name, category }),
    });

    setLoading(false);
    if (res.ok) {
      const { document } = await res.json();
      setDocuments((d) => [
        {
          id: document.id,
          name: document.name,
          category: document.category,
          viewCount: 0,
          createdAt: document.createdAt,
        },
        ...d,
      ]);
      setName("");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addDocument} className="flex flex-wrap gap-3 rounded-lg border border-border bg-surface-elevated p-4">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Document name"
          className="flex-1 rounded-md border border-border bg-surface-page px-3 py-2 text-sm min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
        >
          <option value="deck">Pitch deck</option>
          <option value="financials">Financial model</option>
          <option value="legal">Legal</option>
          <option value="product">Product</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          disabled={loading || !dataRoomId}
          className="rounded-md bg-text-primary px-4 py-2 text-sm text-surface-page disabled:opacity-50"
        >
          Add document
        </button>
      </form>

      <ul className="divide-y divide-border rounded-lg border border-border bg-surface-elevated">
        {documents.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-text-tertiary">
            No documents yet. Add your pitch deck, model, and cap table.
          </li>
        ) : (
          documents.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-text-primary">{d.name}</p>
                <p className="text-xs capitalize text-text-tertiary">{d.category}</p>
              </div>
              <span className="font-mono text-xs text-text-secondary">{d.viewCount} views</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
