const rows = [
  { key: "standard", value: "xeno-skills" },
  { key: "transport", value: "openclink" },
  { key: "design reference", value: "clone space" },
  { key: "repo", value: "xenodeve/Agentic-Framework" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <dl className="grid grid-cols-[8rem_1fr] gap-x-8 gap-y-2 sm:grid-cols-[12rem_1fr]">
          {rows.map((row) => (
            <div key={row.key} className="contents">
              <dt className="metadata">{row.key}</dt>
              <dd className="text-sm text-muted">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="wordmark-outline mt-16 font-display text-6xl font-semibold tracking-tight sm:text-8xl">
          Agentic
        </p>
      </div>
    </footer>
  );
}
