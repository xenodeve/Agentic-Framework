import { getPosts } from "@/lib/content";

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <h1 className="text-h2 font-semibold">Blog</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        Notes on building agent-first — research, post-mortems, and the
        standard as it evolves.
      </p>
      <div className="mt-16 grid divide-y divide-edge">
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
              <h2 className="text-2xl font-semibold group-hover:text-accent">
                {post.title}
              </h2>
            </div>
            <p className="pl-8 text-sm leading-relaxed text-muted">
              {post.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
