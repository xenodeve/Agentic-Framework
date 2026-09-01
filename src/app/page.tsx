import { getEcosystem, getPosts } from "@/lib/content";

export default function HomePage() {
  const items = getEcosystem();
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-4 pt-32 pb-24 sm:px-6">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Agent-first development standard
        </p>
        <h1 className="text-h1 font-semibold">Agentic Framework</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          The operating standard for coding agents as primary developers —
          skills, enforcement hooks, and long-term memory that keep work alive
          across sessions.
        </p>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          xeno-skills · openclink · clone space
        </p>
      </section>

      <section className="border-t border-edge">
        <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-accent">01</span>
            <h2 className="text-h4 font-semibold">Ecosystem</h2>
          </div>
          <div className="mt-12 grid divide-y divide-edge lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {items.map((item, i) => (
              <a
                key={item.slug}
                href={`/ecosystem/${item.slug}`}
                className="group flex h-full flex-col py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-2xl font-semibold group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {item.status}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge">
        <div className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-accent">02</span>
            <h2 className="text-h4 font-semibold">Latest posts</h2>
          </div>
          <div className="mt-12 grid divide-y divide-edge">
            {posts.map((post, i) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 py-8"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs text-muted"
                  >
                    {post.date}
                  </time>
                  <h3 className="text-2xl font-semibold group-hover:text-accent">
                    {post.title}
                  </h3>
                </div>
                <p className="pl-8 text-sm leading-relaxed text-muted">
                  {post.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
