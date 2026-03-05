"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  LOCATIONS,
  SECTORS,
  BUDGET_BANDS,
  TRADES,
} from "@/lib/search-constants";

export function BrowseMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-8 text-sm bg-transparent">
            Browse
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[480px] gap-6 p-4 md:w-[600px] md:grid-cols-3">
              {/* Projects Column */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Projects
                </h3>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                  By Location
                </p>
                <ul className="space-y-0.5">
                  {LOCATIONS.slice(0, 6).map((loc) => (
                    <li key={loc}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=projects&location=${encodeURIComponent(loc)}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {loc}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                  By Sector
                </p>
                <ul className="space-y-0.5">
                  {SECTORS.slice(0, 6).map((sector) => (
                    <li key={sector}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=projects&sector=${encodeURIComponent(sector)}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {sector}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                  By Budget
                </p>
                <ul className="space-y-0.5">
                  {BUDGET_BANDS.map((band) => (
                    <li key={band.value}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=projects&budget=${band.value}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {band.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <NavigationMenuLink asChild>
                  <Link
                    href="/search?type=projects&sort=recent"
                    className="mt-2 block rounded-sm px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Recently Completed &rarr;
                  </Link>
                </NavigationMenuLink>
              </div>

              {/* Businesses Column */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Businesses
                </h3>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                  By Trade
                </p>
                <ul className="space-y-0.5">
                  {TRADES.slice(0, 8).map((trade) => (
                    <li key={trade}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=companies&trade=${encodeURIComponent(trade)}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {trade}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                  By Location
                </p>
                <ul className="space-y-0.5">
                  {LOCATIONS.slice(0, 6).map((loc) => (
                    <li key={loc}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=companies&location=${encodeURIComponent(loc)}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {loc}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <NavigationMenuLink asChild>
                  <Link
                    href="/search?type=companies"
                    className="mt-2 block rounded-sm px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    View all businesses &rarr;
                  </Link>
                </NavigationMenuLink>
              </div>

              {/* People Column */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  People
                </h3>

                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                  By Location
                </p>
                <ul className="space-y-0.5">
                  {LOCATIONS.slice(0, 6).map((loc) => (
                    <li key={loc}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/search?type=people&location=${encodeURIComponent(loc)}`}
                          className="block rounded-sm px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {loc}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                <NavigationMenuLink asChild>
                  <Link
                    href="/search?type=people"
                    className="mt-3 block rounded-sm px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    View all people &rarr;
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
