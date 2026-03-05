"use client";

import { useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { budgetBandLabel } from "@/lib/project-details";

interface FeaturedProject {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  location: string;
  completionYear: number;
  budgetBand: string;
  sectorTags: string[];
  companyName: string;
  companySlug: string;
  scopeSummary: string;
}

export function FeaturedCarousel({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (projects.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="snap-start shrink-0 w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[40vw]"
          >
            <div className="group relative overflow-hidden rounded-xl bg-muted aspect-[16/9]">
              {project.heroImageUrl && (
                <img
                  src={project.heroImageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-xs font-medium text-white/70">
                  {project.companyName}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white line-clamp-2">
                  {project.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white text-xs border-0"
                  >
                    {project.location}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white text-xs border-0"
                  >
                    {project.completionYear}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white text-xs border-0"
                  >
                    {budgetBandLabel(project.budgetBand)}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur hidden sm:flex"
            onClick={() => scroll("left")}
          >
            &larr;
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur hidden sm:flex"
            onClick={() => scroll("right")}
          >
            &rarr;
          </Button>
        </>
      )}
    </div>
  );
}
