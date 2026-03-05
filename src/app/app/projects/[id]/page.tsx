import { notFound } from "next/navigation";
import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "../actions";
import { ProjectForm } from "../_components/project-form";
import { Button } from "@/components/ui/button";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireCompanyAuth();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, companyId: auth.company.id },
  });

  if (!project) notFound();

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/projects">&larr; Back to projects</Link>
        </Button>
      </div>
      <div className="max-w-2xl">
        <ProjectForm
          action={updateProjectAction}
          project={project}
          title="Edit project"
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
