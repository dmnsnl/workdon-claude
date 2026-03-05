import Link from "next/link";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../_components/project-form";
import { Button } from "@/components/ui/button";

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/projects">&larr; Back to projects</Link>
        </Button>
      </div>
      <div className="max-w-2xl">
        <ProjectForm
          action={createProjectAction}
          title="Add project"
          submitLabel="Create project"
        />
      </div>
    </div>
  );
}
