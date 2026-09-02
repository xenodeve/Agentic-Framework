import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Narrative markdown rendered onto the paper system (DESIGN.md). The
 * `prose-light` class maps the typography plugin's colors onto our tokens;
 * code blocks sit on the recessed surface, links use the single accent.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div
      className="
        prose prose-light max-w-none
        prose-p:leading-relaxed prose-p:text-[15px]
        prose-headings:font-display prose-headings:tracking-tight prose-headings:font-semibold
        prose-h2:mt-10 prose-h3:mt-6
        prose-li:leading-relaxed
        prose-a:no-underline prose-a:decoration-edge-strong prose-a:underline-offset-4
        prose-strong:font-semibold
        prose-pre:rounded-lg prose-pre:border prose-pre:border-edge prose-pre:bg-surface
        prose-code:bg-transparent prose-code:p-0 prose-code:before:content-none prose-code:after:content-none
        prose-table:border-edge prose-th:border-edge prose-td:border-edge
        prose-hr:border-edge prose-blockquote:border-l-accent prose-blockquote:not-italic prose-blockquote:text-muted
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
