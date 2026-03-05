import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteProjectAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BUDGET_LABELS: Record<string, string> = {
  UNDER_1M: "Under $1M",
  FROM_1M_TO_10M: "$1M–$10M",
  FROM_10M_TO_50M: "$10M–$50M",
  OVER_50M: "Over $50M",
};

export default async function ProjectsPage() {
  const auth = await requireCompanyAuth();

  const projects = await prisma.project.findMany({
    where: { companyId: auth.company.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Showcase the projects your company has delivered.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/projects/new">Add project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No projects yet. Add your first project to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    <Link
                      href={`/app/projects/${project.id}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {project.location} &middot; {project.completionYear}{" "}
                    &middot; {BUDGET_LABELS[project.budgetBand]}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge
                      variant={
                        project.publishStatus === "PUBLIC"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {project.publishStatus === "PUBLIC"
                        ? "Public"
                        : "Internal"}
                    </Badge>
                    {project.isConfidential && (
                      <Badge variant="outline">Confidential</Badge>
                    )}
                    {project.sectorTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/projects/${project.id}`}>Edit</Link>
                  </Button>
                  <form action={deleteProjectAction}>
                    <input
                      type="hidden"
                      name="projectId"
                      value={project.id}
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
