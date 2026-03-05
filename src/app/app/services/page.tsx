import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteServiceAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ServicesPage() {
  const auth = await requireCompanyAuth();

  const services = await prisma.service.findMany({
    where: { companyId: auth.company.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the services your company offers.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/services/new">Add service</Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No services yet. Add your first service to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    <Link
                      href={`/app/services/${service.id}`}
                      className="hover:underline"
                    >
                      {service.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {service.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge
                      variant={
                        service.publishStatus === "PUBLIC"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {service.publishStatus === "PUBLIC"
                        ? "Public"
                        : "Internal"}
                    </Badge>
                    {service.isConfidential && (
                      <Badge variant="outline">Confidential</Badge>
                    )}
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/services/${service.id}`}>Edit</Link>
                  </Button>
                  <form action={deleteServiceAction}>
                    <input
                      type="hidden"
                      name="serviceId"
                      value={service.id}
                    />
                    <Button variant="ghost" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
