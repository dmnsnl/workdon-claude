import type { PlanTier } from "@/generated/prisma/client";
import { getPlanLimits } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export async function enforcePublicServiceLimit(
  companyId: string,
  planTier: PlanTier,
  excludingServiceId?: string
): Promise<void> {
  const limits = getPlanLimits(planTier);
  const count = await prisma.service.count({
    where: {
      companyId,
      publishStatus: "PUBLIC",
      ...(excludingServiceId ? { id: { not: excludingServiceId } } : {}),
    },
  });

  if (count >= limits.maxPublicServices) {
    throw new Error(
      `Plan limit reached: max ${limits.maxPublicServices} public services on your current plan.`
    );
  }
}

export async function enforcePublicProjectLimit(
  companyId: string,
  planTier: PlanTier,
  excludingProjectId?: string
): Promise<void> {
  const limits = getPlanLimits(planTier);
  const count = await prisma.project.count({
    where: {
      companyId,
      publishStatus: "PUBLIC",
      ...(excludingProjectId ? { id: { not: excludingProjectId } } : {}),
    },
  });

  if (count >= limits.maxPublicProjects) {
    throw new Error(
      `Plan limit reached: max ${limits.maxPublicProjects} public projects on your current plan.`
    );
  }
}

export async function enforceProfileCountLimit(
  companyId: string,
  planTier: PlanTier,
  excludingProfileId?: string
): Promise<void> {
  const limits = getPlanLimits(planTier);
  const count = await prisma.capabilityProfile.count({
    where: {
      companyId,
      ...(excludingProfileId ? { id: { not: excludingProfileId } } : {}),
    },
  });

  if (count >= limits.maxCapabilityProfiles) {
    throw new Error(
      `Plan limit reached: max ${limits.maxCapabilityProfiles} capability profile(s) on your current plan.`
    );
  }
}

export function enforceProfileVisibility(
  planTier: PlanTier,
  requestedVisibility: string
): string {
  const limits = getPlanLimits(planTier);
  if (!limits.allowPublicProfileVisibility && requestedVisibility === "PUBLIC") {
    return "UNLISTED";
  }
  return requestedVisibility;
}
