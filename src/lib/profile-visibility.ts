import type {
  CapabilityProfile,
  Project,
  PublishStatus,
  Service,
} from "@/generated/prisma/client";

export function isPubliclyVisibleItem(
  publishStatus: PublishStatus,
  isConfidential: boolean
): boolean {
  return publishStatus === "PUBLIC" && !isConfidential;
}

export function filterPublicServices<
  T extends Pick<Service, "publishStatus" | "isConfidential">,
>(services: T[]): T[] {
  return services.filter((s) =>
    isPubliclyVisibleItem(s.publishStatus, s.isConfidential)
  );
}

export function filterPublicProjects<
  T extends Pick<Project, "publishStatus" | "isConfidential">,
>(projects: T[]): T[] {
  return projects.filter((p) =>
    isPubliclyVisibleItem(p.publishStatus, p.isConfidential)
  );
}

export type ProfileItemWithData = {
  service: Pick<Service, "publishStatus" | "isConfidential"> | null;
  project: Pick<Project, "publishStatus" | "isConfidential"> | null;
};

export function filterCapabilityItems<T extends ProfileItemWithData>(
  profile: Pick<CapabilityProfile, "includeConfidential">,
  items: T[]
): T[] {
  if (profile.includeConfidential) {
    return items;
  }

  return items.filter((item) => {
    if (item.service) return !item.service.isConfidential;
    if (item.project) return !item.project.isConfidential;
    return false;
  });
}
