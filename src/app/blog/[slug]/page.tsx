import { notFound } from "next/navigation";
import { PostView } from "@/components/article";
import { getPost, getPosts } from "@/lib/content";

type PostPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return <PostView post={post} />;
}
