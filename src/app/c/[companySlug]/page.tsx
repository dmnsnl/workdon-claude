import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}): Promise<Metadata> {
  const { companySlug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
  });
  if (!company) return { title: "Not Found" };
  return {
    title: company.name,
    description:
      company.description || `View ${company.name} on WorkdOn.`,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const [company, teamMembers, caseStudies] = await Promise.all([
    prisma.company.findUnique({
      where: { slug: companySlug },
      include: {
        services: {
          where: { publishStatus: "PUBLIC", isConfidential: false },
          orderBy: { createdAt: "desc" },
        },
        projects: {
          where: { publishStatus: "PUBLIC", isConfidential: false },
          orderBy: { completionYear: "desc" },
          take: 6,
          include: { company: { select: { name: true, slug: true } } },
        },
      },
    }),
    // Team members linked to this company
    prisma.roleExperience.findMany({
      where: {
        linkedCompany: { slug: companySlug },
        isCurrent: true,
      },
      include: {
        personalProfile: {
          select: {
            slug: true,
            fullName: true,
            roleTitle: true,
            profileImageUrl: true,
            yearsExperience: true,
          },
        },
      },
      orderBy: { startYear: "asc" },
      take: 12,
    }),
    // Case studies for this company
    prisma.projectCaseStudy.findMany({
      where: { company: { slug: companySlug } },
      include: {
        project: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  if (!company) notFound();

  // Fire-and-forget view count increment
  prisma.company
    .update({
      where: { id: company.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Unclaimed Banner */}
        {company.isUnclaimed && (
          <div className="mb-6 rounded-lg border border-dashed px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Unclaimed profile
              </span>{" "}
              — This company profile was generated from project credits. If
              this is your company,{" "}
              <Link href="/register" className="underline hover:text-foreground">
                register to claim it
              </Link>
              .
            </p>
          </div>
        )}

        {/* Company header */}
        <div className="flex items-start gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt=""
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded text-xl font-bold text-white"
              style={{ backgroundColor: company.primaryColor }}
            >
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {company.name}
            </h1>
            {company.location && (
              <p className="text-muted-foreground">{company.location}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {company.sectors.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
              {company.trades.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {company.description && (
          <p className="mt-6 max-w-3xl whitespace-pre-line text-muted-foreground">
            {company.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Website
            </a>
          )}
          {company.phone && <span>{company.phone}</span>}
          {company.email && <span>{company.email}</span>}
          {company.viewCount > 0 && (
            <span>{company.viewCount.toLocaleString()} views</span>
          )}
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Team</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {teamMembers.length} team member
                {teamMembers.length !== 1 ? "s" : ""} on WorkdOn
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/people/${exp.personalProfile.slug}`}
                  >
                    <Card className="h-full hover:border-foreground/20 transition-colors">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {exp.personalProfile.profileImageUrl ? (
                            <img
                              src={exp.personalProfile.profileImageUrl}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                              {exp.personalProfile.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <CardTitle className="text-sm truncate">
                              {exp.personalProfile.fullName}
                            </CardTitle>
                            <CardDescription className="text-xs truncate">
                              {exp.roleTitle}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Services */}
        {company.services.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Services</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/c/${company.slug}/services`}>
                    View all &rarr;
                  </Link>
                </Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {company.services.slice(0, 6).map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                      {service.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {service.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Projects */}
        {company.projects.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Projects</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/c/${company.slug}/projects`}>
                    View all &rarr;
                  </Link>
                </Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {company.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    slug={project.slug}
                    title={project.title}
                    heroImageUrl={project.heroImageUrl}
                    location={project.location}
                    completionYear={project.completionYear}
                    budgetBand={project.budgetBand}
                    sectorTags={project.sectorTags}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">
                Case Studies
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {caseStudies.map((cs) => (
                  <Card key={cs.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{cs.title}</CardTitle>
                      <CardDescription>
                        Project:{" "}
                        <Link
                          href={`/projects/${cs.project.slug}`}
                          className="hover:underline"
                        >
                          {cs.project.title}
                        </Link>
                      </CardDescription>
                    </CardHeader>
                    {cs.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {cs.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
