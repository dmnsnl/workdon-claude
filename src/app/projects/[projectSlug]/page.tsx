export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
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
import {
  orderCreditsByImportance,
  budgetBandLabel,
  creditCategoryLabel,
  stakeholderLabel,
} from "@/lib/project-details";
import { formatLocationShort, formatLocationFull } from "@/lib/location";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: { company: { select: { name: true } } },
  });
  if (
    !project ||
    project.publishStatus !== "PUBLIC" ||
    project.isConfidential
  ) {
    return { title: "Not Found" };
  }
  return {
    title: project.title,
    description: `${project.title} by ${project.company.name} — ${formatLocationShort(project)}`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    include: {
      company: true,
      stakeholders: { orderBy: { createdAt: "asc" } },
      credits: {
        orderBy: { sortOrder: "asc" },
        include: {
          linkedPersonalProfile: {
            select: { slug: true, fullName: true },
          },
        },
      },
      mediaItems: { orderBy: { createdAt: "asc" } },
      caseStudies: {
        include: {
          company: {
            select: { name: true, slug: true, logoUrl: true, primaryColor: true },
          },
        },
      },
    },
  });

  if (
    !project ||
    project.publishStatus !== "PUBLIC" ||
    project.isConfidential
  ) {
    notFound();
  }

  // Fire-and-forget view count increment
  prisma.project
    .update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Order credits by importance
  const orderedCredits = orderCreditsByImportance(project.credits);

  // Group credits by role category
  const creditGroups = new Map<
    string,
    typeof orderedCredits
  >();
  const creditOrder = [
    "CONSTRUCTION_MANAGER",
    "ARCHITECT",
    "BUILDER",
    "ENGINEER",
    "SUBCONTRACTOR",
    "OTHER",
  ];
  for (const cat of creditOrder) {
    const items = orderedCredits.filter((c) => c.roleCategory === cat);
    if (items.length > 0) creditGroups.set(cat, items);
  }

  // Group subcontractors by trade
  const subCredits = orderedCredits.filter(
    (c) => c.roleCategory === "SUBCONTRACTOR"
  );
  const tradeGroups = new Map<string, typeof subCredits>();
  for (const c of subCredits) {
    const trade = c.tradeGroup || "General";
    if (!tradeGroups.has(trade)) tradeGroups.set(trade, []);
    tradeGroups.get(trade)!.push(c);
  }

  // Fetch related projects in parallel
  const [moreFromCompany, nearbyProjects, similarProjects] = await Promise.all(
    [
      // More from same company
      prisma.project.findMany({
        where: {
          companyId: project.companyId,
          publishStatus: "PUBLIC",
          isConfidential: false,
          id: { not: project.id },
        },
        include: { company: { select: { name: true, slug: true } } },
        orderBy: { completionYear: "desc" },
        take: 4,
      }),
      // Nearby projects (same city)
      prisma.project.findMany({
        where: {
          publishStatus: "PUBLIC",
          isConfidential: false,
          id: { not: project.id },
          suburb: { equals: project.suburb, mode: "insensitive" },
        },
        include: { company: { select: { name: true, slug: true } } },
        orderBy: { viewCount: "desc" },
        take: 4,
      }),
      // Similar projects (overlapping sector tags)
      project.sectorTags.length > 0
        ? prisma.project.findMany({
            where: {
              publishStatus: "PUBLIC",
              isConfidential: false,
              id: { not: project.id },
              companyId: { not: project.companyId },
              sectorTags: { hasSome: project.sectorTags },
            },
            include: { company: { select: { name: true, slug: true } } },
            orderBy: { viewCount: "desc" },
            take: 4,
          })
        : Promise.resolve([]),
    ]
  );

  // Primary parties for hero overlay
  const primaryParties: Array<{ label: string; name: string; slug?: string }> =
    [];
  const clientStakeholder = project.stakeholders.find(
    (s) => s.role === "CLIENT"
  );
  if (clientStakeholder) {
    primaryParties.push({ label: "Client", name: clientStakeholder.name });
  }
  const architectStakeholder = project.stakeholders.find(
    (s) => s.role === "ARCHITECT"
  );
  if (architectStakeholder) {
    primaryParties.push({ label: "Architect", name: architectStakeholder.name });
  }
  const builderStakeholder = project.stakeholders.find(
    (s) => s.role === "BUILDER"
  );
  if (builderStakeholder) {
    primaryParties.push({ label: "Builder", name: builderStakeholder.name });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      {project.heroImageUrl ? (
        <div className="relative aspect-[21/9] max-h-[500px] w-full overflow-hidden bg-muted">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8">
            <p className="text-sm text-white/70">
              <Link
                href={`/c/${project.company.slug}`}
                className="hover:text-white hover:underline"
              >
                {project.company.name}
              </Link>{" "}
              / Projects
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {project.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white text-sm border-0"
              >
                {formatLocationShort(project)}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white text-sm border-0"
              >
                {project.completionYear}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white text-sm border-0"
              >
                {budgetBandLabel(project.budgetBand)}
              </Badge>
              {project.client && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-sm border-0"
                >
                  Client: {project.client}
                </Badge>
              )}
            </div>
            {primaryParties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
                {primaryParties.map((party) => (
                  <span key={party.label}>
                    <span className="text-white/50">{party.label}:</span>{" "}
                    {party.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 pt-8">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/c/${project.company.slug}`}
              className="hover:underline"
            >
              {project.company.name}
            </Link>{" "}
            / Projects
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {project.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
            <span>{formatLocationShort(project)}</span>
            <span>&middot;</span>
            <span>{project.completionYear}</span>
            <span>&middot;</span>
            <span>{budgetBandLabel(project.budgetBand)}</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Sector Tags */}
        {project.sectorTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.sectorTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Description & Scope */}
        <section>
          <h2 className="text-xl font-bold tracking-tight">About This Project</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatLocationFull(project)}
          </p>
          <p className="mt-2 whitespace-pre-line text-muted-foreground">
            {project.scopeSummary}
          </p>
          {project.description &&
            project.description !== project.scopeSummary && (
              <p className="mt-4 whitespace-pre-line text-muted-foreground">
                {project.description}
              </p>
            )}
        </section>

        {/* Features */}
        {project.features.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">
                Key Features
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-sm">
                    {feature}
                  </Badge>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Case Study */}
        {project.caseStudy && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Case Study</h2>
              <div className="mt-2 whitespace-pre-line text-muted-foreground">
                {project.caseStudy}
              </div>
            </section>
          </>
        )}

        {/* Media Gallery */}
        {project.mediaItems.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Media</h2>
              <div className="mt-4">
                {/* First image large */}
                {project.mediaItems[0] && (
                  <div className="mb-4">
                    {project.mediaItems[0].mediaType === "IMAGE" ? (
                      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                        <img
                          src={project.mediaItems[0].url}
                          alt={
                            project.mediaItems[0].caption || project.title
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video">
                        <video
                          src={project.mediaItems[0].url}
                          controls
                          className="h-full w-full rounded-lg"
                        />
                      </div>
                    )}
                    {project.mediaItems[0].caption && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {project.mediaItems[0].caption}
                      </p>
                    )}
                  </div>
                )}
                {/* Rest in grid */}
                {project.mediaItems.length > 1 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.mediaItems.slice(1).map((media) => (
                      <div key={media.id}>
                        {media.mediaType === "IMAGE" ? (
                          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                            <img
                              src={media.url}
                              alt={media.caption || project.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video">
                            <video
                              src={media.url}
                              controls
                              className="h-full w-full rounded-lg"
                            />
                          </div>
                        )}
                        {media.caption && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {media.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Credits */}
        {creditGroups.size > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Credits</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {orderedCredits.length} credited{" "}
                {orderedCredits.length === 1 ? "party" : "parties"} on this
                project
              </p>
              <div className="mt-4 space-y-6">
                {Array.from(creditGroups.entries()).map(
                  ([category, credits]) => {
                    // For subcontractors, sub-group by trade
                    if (category === "SUBCONTRACTOR") {
                      return (
                        <div key={category}>
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Subcontractors
                          </h3>
                          <div className="mt-2 space-y-4">
                            {Array.from(tradeGroups.entries()).map(
                              ([trade, tradeCredits]) => (
                                <div key={trade}>
                                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">
                                    {trade}
                                  </h4>
                                  <div className="space-y-1">
                                    {tradeCredits.map((credit) => (
                                      <CreditRow
                                        key={credit.id}
                                        credit={credit}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={category}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          {creditCategoryLabel(
                            category as Parameters<
                              typeof creditCategoryLabel
                            >[0]
                          )}
                        </h3>
                        <div className="mt-2 space-y-1">
                          {credits.map((credit) => (
                            <CreditRow key={credit.id} credit={credit} />
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          </>
        )}

        {/* Case Study Links */}
        {project.caseStudies.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">
                Case Study Links
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.caseStudies.map((cs) => (
                  <Card key={cs.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {cs.company.logoUrl ? (
                          <img
                            src={cs.company.logoUrl}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-white"
                            style={{
                              backgroundColor: cs.company.primaryColor,
                            }}
                          >
                            {cs.company.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-sm">
                            {cs.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            by{" "}
                            <Link
                              href={`/c/${cs.company.slug}`}
                              className="hover:underline"
                            >
                              {cs.company.name}
                            </Link>
                          </CardDescription>
                        </div>
                      </div>
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

        {/* Key Stakeholders */}
        {project.stakeholders.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">
                Key Stakeholders
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.stakeholders.map((sh) => (
                  <Card key={sh.id}>
                    <CardHeader className="pb-2">
                      <CardDescription>
                        {stakeholderLabel(sh.role)}
                      </CardDescription>
                      <CardTitle className="text-base">{sh.name}</CardTitle>
                    </CardHeader>
                    {sh.companyName && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {sh.companyName}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Related Projects */}
        {(moreFromCompany.length > 0 ||
          nearbyProjects.length > 0 ||
          similarProjects.length > 0) && (
          <>
            <Separator className="my-8" />
            <section className="space-y-8">
              <h2 className="text-xl font-bold tracking-tight">
                Related Projects
              </h2>

              {moreFromCompany.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    More from {project.company.name}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {moreFromCompany.map((p) => (
                      <ProjectCard
                        key={p.id}
                        slug={p.slug}
                        title={p.title}
                        heroImageUrl={p.heroImageUrl}
                        suburb={p.suburb}
                        state={p.state}
                        country={p.country}
                        completionYear={p.completionYear}
                        budgetBand={p.budgetBand}
                        sectorTags={p.sectorTags}
                      />
                    ))}
                  </div>
                </div>
              )}

              {nearbyProjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Nearby Projects
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {nearbyProjects.map((p) => (
                      <ProjectCard
                        key={p.id}
                        slug={p.slug}
                        title={p.title}
                        heroImageUrl={p.heroImageUrl}
                        suburb={p.suburb}
                        state={p.state}
                        country={p.country}
                        completionYear={p.completionYear}
                        budgetBand={p.budgetBand}
                        sectorTags={p.sectorTags}
                        companyName={p.company.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {similarProjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Similar Projects
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {similarProjects.map((p) => (
                      <ProjectCard
                        key={p.id}
                        slug={p.slug}
                        title={p.title}
                        heroImageUrl={p.heroImageUrl}
                        suburb={p.suburb}
                        state={p.state}
                        country={p.country}
                        completionYear={p.completionYear}
                        budgetBand={p.budgetBand}
                        sectorTags={p.sectorTags}
                        companyName={p.company.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── Credit Row Component ─────────────────────────────────

function CreditRow({
  credit,
}: {
  credit: {
    id: string;
    entityType: string;
    entityName: string;
    tradeGroup: string | null;
    linkedCompanySlug: string | null;
    isVerified: boolean;
    linkedPersonalProfile: {
      slug: string;
      fullName: string;
    } | null;
  };
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-2">
        {credit.entityType === "PERSON" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {credit.entityName.charAt(0)}
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
            {credit.entityName.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium">
          {credit.linkedPersonalProfile ? (
            <Link
              href={`/people/${credit.linkedPersonalProfile.slug}`}
              className="hover:underline"
            >
              {credit.entityName}
            </Link>
          ) : (
            credit.entityName
          )}
        </span>
        {credit.isVerified && (
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0"
          >
            Verified
          </Badge>
        )}
        {credit.tradeGroup && (
          <Badge variant="outline" className="ml-1 text-xs">
            {credit.tradeGroup}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {credit.linkedCompanySlug && (
          <Link
            href={`/c/${credit.linkedCompanySlug}`}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            View company
          </Link>
        )}
        {credit.linkedPersonalProfile && (
          <Link
            href={`/people/${credit.linkedPersonalProfile.slug}`}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            View profile
          </Link>
        )}
      </div>
    </div>
  );
}
