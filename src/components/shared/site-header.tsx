import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "@/components/shared/search-autocomplete";
import { BrowseMenu } from "@/components/shared/browse-menu";
import { MobileNav } from "@/components/shared/mobile-nav";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Mobile hamburger */}
        <MobileNav />

        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight shrink-0">
          WorkdOn
        </Link>

        {/* Desktop nav: Browse menu */}
        <div className="hidden md:flex items-center">
          <BrowseMenu />
        </div>

        {/* Desktop search bar — centered, flexible width */}
        <div className="hidden md:block flex-1 max-w-md mx-auto">
          <SearchAutocomplete />
        </div>

        {/* Desktop right-side links */}
        <nav className="hidden md:flex items-center gap-4 text-sm ml-auto shrink-0">
          <Link
            href="/search?type=companies"
            className="text-muted-foreground hover:text-foreground"
          >
            Companies
          </Link>
          <Link
            href="/search?type=people"
            className="text-muted-foreground hover:text-foreground"
          >
            People
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </nav>

        {/* Mobile sign-in */}
        <div className="ml-auto md:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
