import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getPost, getPosts } from "@/lib/content";

type PostPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <time dateTime={post.date} className="font-mono text-xs text-muted">
        {post.date}
      </time>
      <h1 className="mt-4 text-h2 font-semibold">{post.title}</h1>
      <div className="mt-12 border-t border-edge pt-12">
        <Markdown>{post.body}</Markdown>
      </div>
    </article>
  );
}
