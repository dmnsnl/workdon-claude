export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ProjectCard } from "@/components/shared/project-card";
import { CompanyCard } from "@/components/shared/company-card";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { HeroSection } from "@/components/home/hero-section";
import { budgetBandLabel } from "@/lib/project-details";
import { LOCATIONS, SECTORS } from "@/lib/search-constants";
import { formatLocationShort } from "@/lib/location";

export default async function HomePage() {
  const [
    featuredProjects,
    spotlightProject,
    recentProjects,
    popularProjects,
    trendingCompanies,
    trendingPeople,
    articles,
    projectCount,
    companyCount,
    peopleCount,
  ] = await Promise.all([
    // Featured carousel projects
    prisma.project.findMany({
      where: {
        publishStatus: "PUBLIC",
        isConfidential: false,
        isFeatured: true,
      },
      include: { company: { select: { name: true, slug: true } } },
      orderBy: { viewCount: "desc" },
      take: 8,
    }),
    // Spotlight project
    prisma.project.findFirst({
      where: {
        publishStatus: "PUBLIC",
        isConfidential: false,
        isSpotlight: true,
      },
      include: {
        company: { select: { name: true, slug: true, primaryColor: true } },
      },
    }),
    // Recently completed
    prisma.project.findMany({
      where: { publishStatus: "PUBLIC", isConfidential: false },
      include: { company: { select: { name: true, slug: true } } },
      orderBy: { completionYear: "desc" },
      take: 8,
    }),
    // Most popular
    prisma.project.findMany({
      where: { publishStatus: "PUBLIC", isConfidential: false },
      include: { company: { select: { name: true, slug: true } } },
      orderBy: { viewCount: "desc" },
      take: 8,
    }),
    // Trending companies
    prisma.company.findMany({
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
      take: 8,
    }),
    // Trending people
    prisma.personalProfile.findMany({
      include: {
        _count: { select: { projectExperiences: true } },
        user: { select: { companyId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    // Articles
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
    // Counts for hero stats
    prisma.project.count({
      where: { publishStatus: "PUBLIC", isConfidential: false },
    }),
    prisma.company.count(),
    prisma.personalProfile.count(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <HeroSection
        featuredProject={
          featuredProjects[0]
            ? {
                slug: featuredProjects[0].slug,
                title: featuredProjects[0].title,
                heroImageUrl: featuredProjects[0].heroImageUrl,
                suburb: featuredProjects[0].suburb,
                state: featuredProjects[0].state,
                country: featuredProjects[0].country,
                sectorTags: featuredProjects[0].sectorTags,
                budgetBand: featuredProjects[0].budgetBand,
                companyName: featuredProjects[0].company.name,
              }
            : null
        }
        secondProject={
          featuredProjects[1]
            ? {
                slug: featuredProjects[1].slug,
                title: featuredProjects[1].title,
                heroImageUrl: featuredProjects[1].heroImageUrl,
                suburb: featuredProjects[1].suburb,
                state: featuredProjects[1].state,
                country: featuredProjects[1].country,
                sectorTags: featuredProjects[1].sectorTags,
                budgetBand: featuredProjects[1].budgetBand,
                companyName: featuredProjects[1].company.name,
              }
            : null
        }
        article={
          articles[0]
            ? {
                slug: articles[0].slug,
                title: articles[0].title,
                heroImageUrl: articles[0].heroImageUrl,
                authorName: articles[0].authorName,
              }
            : null
        }
        avatarPeople={trendingPeople.slice(0, 5).map((p) => ({
          fullName: p.fullName,
          profileImageUrl: p.profileImageUrl,
        }))}
        stats={{ projectCount, companyCount, peopleCount }}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        {/* Featured Carousel */}
        {featuredProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Projects
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search?type=projects">View all &rarr;</Link>
              </Button>
            </div>
            <FeaturedCarousel
              projects={featuredProjects.map((p) => ({
                slug: p.slug,
                title: p.title,
                heroImageUrl: p.heroImageUrl,
                suburb: p.suburb,
                state: p.state,
                country: p.country,
                completionYear: p.completionYear,
                budgetBand: p.budgetBand,
                sectorTags: p.sectorTags,
                companyName: p.company.name,
                companySlug: p.company.slug,
                scopeSummary: p.scopeSummary,
              }))}
            />
          </section>
        )}

        {/* Project Spotlight */}
        {spotlightProject && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Project Spotlight
            </h2>
            <Link href={`/projects/${spotlightProject.slug}`}>
              <Card className="overflow-hidden hover:border-foreground/20 transition-colors">
                <div className="grid md:grid-cols-2">
                  {spotlightProject.heroImageUrl && (
                    <div className="aspect-[16/9] md:aspect-auto overflow-hidden bg-muted">
                      <img
                        src={spotlightProject.heroImageUrl}
                        alt={spotlightProject.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit text-xs mb-3">
                      Spotlight
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {spotlightProject.company.name}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">
                      {spotlightProject.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground line-clamp-3">
                      {spotlightProject.scopeSummary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge variant="outline">
                        {formatLocationShort(spotlightProject)}
                      </Badge>
                      <Badge variant="outline">
                        {spotlightProject.completionYear}
                      </Badge>
                      <Badge variant="outline">
                        {budgetBandLabel(spotlightProject.budgetBand)}
                      </Badge>
                      {spotlightProject.sectorTags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* Recently Completed */}
        {recentProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Recently Completed
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search?type=projects">View all &rarr;</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentProjects.map((project) => (
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
                />
              ))}
            </div>
          </section>
        )}

        {/* Most Popular */}
        {popularProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Most Popular
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search?type=projects">View all &rarr;</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularProjects.map((project) => (
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
          </section>
        )}

        {/* Browse By */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight">Browse By</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Location
              </h3>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <Link
                    key={loc.suburb}
                    href={`/search?type=projects&location=${encodeURIComponent(loc.suburb)}`}
                  >
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-foreground hover:text-background transition-colors px-3 py-1"
                    >
                      {loc.label}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Sector
              </h3>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((sector) => (
                  <Link
                    key={sector}
                    href={`/search?type=projects&sector=${encodeURIComponent(sector)}`}
                  >
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-foreground hover:text-background transition-colors px-3 py-1"
                    >
                      {sector}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Companies */}
        {trendingCompanies.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Trending Companies
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search?type=companies">View all &rarr;</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingCompanies.map((company) => (
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
          </section>
        )}

        {/* Trending Professionals */}
        {trendingPeople.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Trending Professionals
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search?type=people">View all &rarr;</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingPeople.map((person) => (
                <Link key={person.id} href={`/people/${person.slug}`}>
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
                          <CardDescription className="truncate">
                            {person.roleTitle || person.headline || ""}
                          </CardDescription>
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
          </section>
        )}

        {/* News & Articles */}
        {articles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight">
              News &amp; Articles
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:border-foreground/20 transition-colors"
                >
                  {article.heroImageUrl && (
                    <div className="aspect-[21/9] overflow-hidden rounded-t-xl bg-muted">
                      <img
                        src={article.heroImageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      {article.authorName}
                      {article.publishedAt && (
                        <>
                          {" "}
                          &middot;{" "}
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-AU",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
