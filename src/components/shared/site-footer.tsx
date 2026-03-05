import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="font-semibold text-foreground">
              WorkdOn
            </Link>
            <Link href="/search" className="hover:text-foreground">
              Search
            </Link>
            <Link
              href="/search?type=companies"
              className="hover:text-foreground"
            >
              Companies
            </Link>
            <Link href="/search?type=people" className="hover:text-foreground">
              People
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WorkdOn. Construction industry
            credits &amp; showcase.
          </p>
        </div>
      </div>
    </footer>
  );
}
