"use client";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const snippets = [
  { label: "H2", value: "## Section heading" },
  { label: "Quote", value: "> Reporter quote or key takeaway" },
  { label: "Bullets", value: "- First point\n- Second point\n- Third point" },
];

export function AdminRichTextEditor({ value, onChange }: RichTextEditorProps) {
  function insertSnippet(snippet: string) {
    const nextValue = value.trim().length ? `${value}\n\n${snippet}` : snippet;
    onChange(nextValue);
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-3 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
          Rich text tools
        </span>
        {snippets.map((snippet) => (
          <button
            key={snippet.label}
            type="button"
            onClick={() => insertSnippet(snippet.value)}
            className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {snippet.label}
          </button>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write the article body with paragraphs, subheads, pull quotes, and bullet lists."
        rows={18}
        className="min-h-[26rem] w-full resize-y border-0 bg-white px-4 py-4 text-sm leading-7 text-[var(--text-primary)] outline-none"
      />
    </div>
  );
}
