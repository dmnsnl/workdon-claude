import { notFound } from "next/navigation";
import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateProfileAction } from "../actions";
import { ProfileForm } from "../_components/profile-form";
import { ProfileItemManager } from "./_components/profile-item-manager";
import { Button } from "@/components/ui/button";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireCompanyAuth();
  const { id } = await params;

  const profile = await prisma.capabilityProfile.findFirst({
    where: { id, companyId: auth.company.id },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: { service: true, project: true },
      },
    },
  });

  if (!profile) notFound();

  const [services, projects] = await Promise.all([
    prisma.service.findMany({
      where: { companyId: auth.company.id },
      orderBy: { title: "asc" },
    }),
    prisma.project.findMany({
      where: { companyId: auth.company.id },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/profiles">&larr; Back to profiles</Link>
        </Button>
      </div>
      <div className="space-y-8 max-w-2xl">
        <ProfileForm
          action={updateProfileAction}
          profile={profile}
          title="Edit capability profile"
          submitLabel="Save changes"
        />
        <ProfileItemManager
          profileId={profile.id}
          currentItems={profile.items.map((item) => ({
            id: item.id,
            itemType: item.itemType,
            serviceId: item.serviceId,
            projectId: item.projectId,
            title:
              item.itemType === "SERVICE"
                ? item.service?.title ?? "Unknown"
                : item.project?.title ?? "Unknown",
          }))}
          availableServices={services.map((s) => ({
            id: s.id,
            title: s.title,
          }))}
          availableProjects={projects.map((p) => ({
            id: p.id,
            title: p.title,
          }))}
        />
      </div>
    </div>
  );
}
