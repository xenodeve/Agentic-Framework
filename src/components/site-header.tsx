import Link from "next/link";

const links = [
  { href: "/#skills", label: "Skills" },
  { href: "/ecosystem/openclink", label: "Openclink" },
  { href: "/ecosystem/clone-space", label: "Clone Space" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="glass-layer mx-auto flex h-12 w-full max-w-4xl items-center justify-between rounded-full px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Agentic Framework
        </Link>
        <nav className="flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
