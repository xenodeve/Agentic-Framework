import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getEcosystem, getEcosystemItem } from "@/lib/content";

type EcosystemItemPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getEcosystem().map((item) => ({ slug: item.slug }));
}

export default async function EcosystemItemPage({
  params,
}: EcosystemItemPageProps) {
  const { slug } = await params;
  const item = getEcosystemItem(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">Ecosystem</p>
      <h1 className="mt-4 text-h2 font-semibold">{item.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        {item.description}
      </p>
      <p className="mt-4 font-mono text-xs text-muted">{item.status}</p>
      <div className="mt-12 border-t border-edge pt-12">
        <Markdown>{item.body}</Markdown>
      </div>
    </article>
  );
}
