import { notFound } from "next/navigation";
import { EcosystemItemView } from "@/components/article";
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

  return <EcosystemItemView item={item} />;
}
