import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export default async function CompanyServicesPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
    include: {
      services: {
        where: { publishStatus: "PUBLIC", isConfidential: false },
        orderBy: { createdAt: "desc" },
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
          / Services
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Services by {company.name}
        </h1>

        {company.services.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No public services.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {service.description}
                  </p>
                  {service.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
