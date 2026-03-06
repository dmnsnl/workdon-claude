"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SECTORS } from "@/lib/search-constants";

const MAX_VISIBLE = 6;

export function HeroSectorPills() {
  const visible = SECTORS.slice(0, MAX_VISIBLE);
  const hasMore = SECTORS.length > MAX_VISIBLE;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((sector) => (
        <Link
          key={sector}
          href={`/search?type=projects&sector=${encodeURIComponent(sector)}`}
        >
          <Badge
            variant="outline"
            className="cursor-pointer whitespace-nowrap hover:bg-foreground hover:text-background transition-colors text-xs"
          >
            {sector}
          </Badge>
        </Link>
      ))}
      {hasMore && (
        <Link href="/search?type=projects">
          <Badge
            variant="outline"
            className="cursor-pointer whitespace-nowrap hover:bg-foreground hover:text-background transition-colors text-xs"
          >
            More…
          </Badge>
        </Link>
      )}
    </div>
  );
}
