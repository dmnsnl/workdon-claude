import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          WorkdOn
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/search"
            className="text-muted-foreground hover:text-foreground"
          >
            Search
          </Link>
          <Link
            href="/search?type=companies"
            className="text-muted-foreground hover:text-foreground hidden sm:inline"
          >
            Companies
          </Link>
          <Link
            href="/search?type=people"
            className="text-muted-foreground hover:text-foreground hidden sm:inline"
          >
            People
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
