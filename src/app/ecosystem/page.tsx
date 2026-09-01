import { getEcosystem } from "@/lib/content";

export default function EcosystemPage() {
  const items = getEcosystem();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6">
      <h1 className="text-h2 font-semibold">Ecosystem</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Projects the team runs agent-first — each one built and maintained with
        the standard it documents.
      </p>
      <div className="mt-16 grid divide-y divide-edge">
        {items.map((item, i) => (
          <a
            key={item.slug}
            href={`/ecosystem/${item.slug}`}
            className="group flex flex-col gap-6 py-8 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl font-semibold group-hover:text-accent">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {item.status}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
