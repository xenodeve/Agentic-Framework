import { getPosts } from "@/lib/content";
import { BlogList } from "@/components/blog-list";

export default function BlogPage() {
  return <BlogList posts={getPosts()} />;
}
