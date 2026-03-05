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
import { formatLocationShort } from "@/lib/location";

const BUDGET_LABELS: Record<string, string> = {
  UNDER_1M: "Under $1M",
  FROM_1M_TO_10M: "$1M–$10M",
  FROM_10M_TO_50M: "$10M–$50M",
  OVER_50M: "Over $50M",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}): Promise<Metadata> {
  const { profileSlug } = await params;
  const profile = await prisma.capabilityProfile.findUnique({
    where: { slug: profileSlug },
    include: { company: { select: { name: true } } },
  });
  if (!profile) return { title: "Not Found" };

  const meta: Metadata = {
    title: `${profile.title} — ${profile.company.name}`,
  };
  if (profile.visibility === "UNLISTED") {
    meta.robots = { index: false, follow: false };
  }
  return meta;
}

export default async function CapabilityProfilePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const profile = await prisma.capabilityProfile.findUnique({
    where: { slug: profileSlug },
    include: {
      company: true,
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          service: true,
          project: true,
        },
      },
    },
  });

  if (!profile) notFound();

  // Filter items based on confidentiality settings
  const visibleItems = profile.items.filter((item) => {
    if (profile.includeConfidential) return true;
    if (item.itemType === "SERVICE" && item.service) {
      return !item.service.isConfidential;
    }
    if (item.itemType === "PROJECT" && item.project) {
      return !item.project.isConfidential;
    }
    return true;
  });

  const services = visibleItems.filter(
    (i) => i.itemType === "SERVICE" && i.service
  );
  const projects = visibleItems.filter(
    (i) => i.itemType === "PROJECT" && i.project
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Company branding */}
        <div className="flex items-center gap-3">
          {profile.company.logoUrl ? (
            <img
              src={profile.company.logoUrl}
              alt=""
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded text-lg font-bold text-white"
              style={{ backgroundColor: profile.company.primaryColor }}
            >
              {profile.company.name.charAt(0)}
            </div>
          )}
          <div>
            <Link
              href={`/c/${profile.company.slug}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {profile.company.name}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.title}
            </h1>
          </div>
        </div>

        {profile.introText && (
          <p className="mt-6 whitespace-pre-line text-muted-foreground">
            {profile.introText}
          </p>
        )}

        {/* Services section */}
        {services.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Services</h2>
              <div className="mt-4 space-y-4">
                {services.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {item.service!.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {item.service!.description}
                      </p>
                      {item.service!.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.service!.tags.map((tag) => (
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

        {/* Projects section */}
        {projects.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold tracking-tight">Projects</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {projects.map((item) => {
                  const proj = item.project!;
                  const isPublic =
                    proj.publishStatus === "PUBLIC" && !proj.isConfidential;
                  return (
                    <Card key={item.id}>
                      {proj.heroImageUrl && (
                        <div className="aspect-[16/9] overflow-hidden rounded-t-xl bg-muted">
                          <img
                            src={proj.heroImageUrl}
                            alt={proj.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-base">
                          {isPublic ? (
                            <Link
                              href={`/projects/${proj.slug}`}
                              className="hover:underline"
                            >
                              {proj.title}
                            </Link>
                          ) : (
                            proj.title
                          )}
                        </CardTitle>
                        <CardDescription>
                          {formatLocationShort(proj)} &middot; {proj.completionYear}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {proj.scopeSummary}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {BUDGET_LABELS[proj.budgetBand]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}
