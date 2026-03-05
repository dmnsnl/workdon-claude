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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const query = q?.trim() || "";
  const activeType = type || "projects";

  const where = query
    ? { contains: query, mode: "insensitive" as const }
    : undefined;

  const [projects, companies, people] = await Promise.all([
    activeType === "projects" || !activeType
      ? prisma.project.findMany({
          where: {
            publishStatus: "PUBLIC",
            isConfidential: false,
            ...(where
              ? {
                  OR: [
                    { title: where },
                    { location: where },
                    { scopeSummary: where },
                  ],
                }
              : {}),
          },
          include: { company: { select: { name: true, slug: true } } },
          orderBy: { viewCount: "desc" },
          take: 24,
        })
      : [],
    activeType === "companies"
      ? prisma.company.findMany({
          where: where
            ? { OR: [{ name: where }, { location: where }] }
            : undefined,
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
          where: where
            ? {
                OR: [
                  { fullName: where },
                  { headline: where },
                  { location: where },
                ],
              }
            : undefined,
          include: {
            _count: { select: { projectExperiences: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 24,
        })
      : [],
  ]);

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
            <Link
              key={tab.key}
              href={`/search?type=${tab.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            >
              <Button
                variant={activeType === tab.key ? "default" : "ghost"}
                size="sm"
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Results */}
        <div className="mt-6">
          {activeType === "projects" && (
            <>
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
                      location={project.location}
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      slug={company.slug}
                      name={company.name}
                      logoUrl={company.logoUrl}
                      primaryColor={company.primaryColor}
                      location={company.location}
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
                            {person._count.projectExperiences !== 1 ? "s" : ""}
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
      </main>

      <SiteFooter />
    </div>
  );
}
