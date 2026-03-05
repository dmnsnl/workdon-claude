export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ProjectCard } from "@/components/shared/project-card";
import { CompanyCard } from "@/components/shared/company-card";
import { SearchFilters } from "@/components/shared/search-filters";
import { MobileFilterSheet } from "@/components/shared/mobile-filter-sheet";
import { SearchMapToggle } from "@/components/shared/search-map-toggle";
import { formatLocationShort } from "@/lib/location";
import { EXPERIENCE_RANGES } from "@/lib/search-constants";

interface SearchParams {
  q?: string;
  type?: string;
  location?: string;
  sector?: string;
  budget?: string;
  year?: string;
  trade?: string;
  experience?: string;
  sort?: string;
  view?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    q,
    type,
    location,
    sector,
    budget,
    year,
    trade,
    experience,
    sort,
  } = await searchParams;

  const query = q?.trim() || "";
  const activeType = type || "projects";

  const textWhere = query
    ? { contains: query, mode: "insensitive" as const }
    : undefined;

  // --- Build project query ---
  const projectWhere: Record<string, unknown> = {
    publishStatus: "PUBLIC",
    isConfidential: false,
  };

  if (textWhere) {
    projectWhere.OR = [
      { title: textWhere },
      { suburb: textWhere },
      { scopeSummary: textWhere },
    ];
  }
  if (location) {
    projectWhere.suburb = {
      contains: location,
      mode: "insensitive" as const,
    };
  }
  if (sector) {
    projectWhere.sectorTags = { has: sector };
  }
  if (budget) {
    projectWhere.budgetBand = budget;
  }
  if (year) {
    projectWhere.completionYear = parseInt(year, 10);
  }

  const projectOrderBy =
    sort === "recent"
      ? ({ completionYear: "desc" } as const)
      : ({ viewCount: "desc" } as const);

  // --- Build company query ---
  const companyWhere: Record<string, unknown> = {};

  if (textWhere) {
    companyWhere.OR = [{ name: textWhere }, { suburb: textWhere }];
  }
  if (location) {
    companyWhere.suburb = {
      contains: location,
      mode: "insensitive" as const,
    };
  }
  if (trade) {
    companyWhere.trades = { has: trade };
  }
  if (sector && activeType === "companies") {
    companyWhere.sectors = { has: sector };
  }

  // --- Build people query ---
  const peopleWhere: Record<string, unknown> = {};

  if (textWhere) {
    peopleWhere.OR = [
      { fullName: textWhere },
      { headline: textWhere },
      { location: textWhere },
    ];
  }
  if (location) {
    peopleWhere.location = {
      contains: location,
      mode: "insensitive" as const,
    };
  }
  if (experience) {
    const range = EXPERIENCE_RANGES.find((r) => r.value === experience);
    if (range) {
      peopleWhere.yearsExperience = { gte: range.min, lte: range.max };
    }
  }

  // --- Execute queries ---
  const [projects, companies, people] = await Promise.all([
    activeType === "projects" || !activeType
      ? prisma.project.findMany({
          where: projectWhere,
          include: { company: { select: { name: true, slug: true } } },
          orderBy: projectOrderBy,
          take: 24,
        })
      : [],
    activeType === "companies"
      ? prisma.company.findMany({
          where: Object.keys(companyWhere).length > 0 ? companyWhere : undefined,
          include: {
            _count: {
              select: {
                projects: {
                  where: { publishStatus: "PUBLIC", isConfidential: false },
                },
              },
            },
          },
          orderBy: { viewCount: "desc" },
          take: 24,
        })
      : [],
    activeType === "people"
      ? prisma.personalProfile.findMany({
          where: Object.keys(peopleWhere).length > 0 ? peopleWhere : undefined,
          include: {
            _count: { select: { projectExperiences: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 24,
        })
      : [],
  ]);

  // Preserve current filter params when switching tabs
  function tabHref(tabType: string) {
    const params = new URLSearchParams();
    params.set("type", tabType);
    if (query) params.set("q", query);
    // Carry over location since it applies to all types
    if (location) params.set("location", location);
    if (sort) params.set("sort", sort);
    return `/search?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>

        {/* Search form */}
        <form className="mt-4 flex gap-2" method="GET" action="/search">
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search projects, companies, people..."
            className="max-w-md"
          />
          <input type="hidden" name="type" value={activeType} />
          <Button type="submit">Search</Button>
        </form>

        {/* Type tabs */}
        <div className="mt-6 flex gap-2 border-b pb-2">
          {[
            { key: "projects", label: "Projects" },
            { key: "companies", label: "Companies" },
            { key: "people", label: "People" },
          ].map((tab) => (
            <Link key={tab.key} href={tabHref(tab.key)}>
              <Button
                variant={activeType === tab.key ? "default" : "ghost"}
                size="sm"
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile filter button */}
        <div className="mt-4 md:hidden">
          <MobileFilterSheet activeType={activeType} />
        </div>

        {/* Main content: sidebar + results grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
          {/* Desktop sidebar filters */}
          <aside className="hidden md:block">
            <SearchFilters activeType={activeType} />
          </aside>

          {/* Results */}
          <div>
            {activeType === "projects" && (
              <>
                <SearchMapToggle
                  markers={projects
                    .filter((p) => p.latitude != null && p.longitude != null)
                    .map((p) => ({
                      lat: p.latitude!,
                      lng: p.longitude!,
                      title: p.title,
                      href: `/projects/${p.slug}`,
                      subtitle: formatLocationShort(p),
                    }))}
                />
                {projects.length === 0 ? (
                  <p className="text-muted-foreground">No projects found.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        slug={project.slug}
                        title={project.title}
                        heroImageUrl={project.heroImageUrl}
                        suburb={project.suburb}
                        state={project.state}
                        country={project.country}
                        completionYear={project.completionYear}
                        budgetBand={project.budgetBand}
                        sectorTags={project.sectorTags}
                        companyName={project.company.name}
                        viewCount={project.viewCount}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeType === "companies" && (
              <>
                {companies.length === 0 ? (
                  <p className="text-muted-foreground">No companies found.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => (
                      <CompanyCard
                        key={company.id}
                        slug={company.slug}
                        name={company.name}
                        logoUrl={company.logoUrl}
                        primaryColor={company.primaryColor}
                        suburb={company.suburb}
                        state={company.state}
                        country={company.country}
                        sectors={company.sectors}
                        projectCount={company._count.projects}
                        viewCount={company.viewCount}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeType === "people" && (
              <>
                {people.length === 0 ? (
                  <p className="text-muted-foreground">No people found.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                      <Link
                        key={person.id}
                        href={`/people/${person.slug}`}
                      >
                        <Card className="h-full hover:border-foreground/20 transition-colors">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              {person.profileImageUrl ? (
                                <img
                                  src={person.profileImageUrl}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                                  {person.fullName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <CardTitle className="text-base truncate">
                                  {person.fullName}
                                </CardTitle>
                                {person.headline && (
                                  <CardDescription className="truncate">
                                    {person.headline}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {person.location && (
                              <p className="text-sm text-muted-foreground">
                                {person.location}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {person._count.projectExperiences} project
                              {person._count.projectExperiences !== 1
                                ? "s"
                                : ""}
                              {person.yearsExperience > 0 &&
                                ` · ${person.yearsExperience} yrs exp`}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
