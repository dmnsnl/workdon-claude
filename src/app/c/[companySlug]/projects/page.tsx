import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ProjectCard } from "@/components/shared/project-card";

export default async function CompanyProjectsPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
    include: {
      projects: {
        where: { publishStatus: "PUBLIC", isConfidential: false },
        orderBy: { completionYear: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-muted-foreground">
          <Link href={`/c/${company.slug}`} className="hover:underline">
            {company.name}
          </Link>{" "}
          / Projects
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Projects by {company.name}
        </h1>

        {company.projects.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No public projects.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
