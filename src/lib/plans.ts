import type { PlanTier } from "@/generated/prisma/client";

export const PLAN_LIMITS = {
  FREE: {
    maxPublicServices: 5,
    maxPublicProjects: 5,
    maxCapabilityProfiles: 1,
    allowPublicProfileVisibility: false,
  },
  STANDARD: {
    maxPublicServices: 1000,
    maxPublicProjects: 1000,
    maxCapabilityProfiles: 50,
    allowPublicProfileVisibility: true,
  },
} as const;

export function getPlanLimits(planTier: PlanTier) {
  return PLAN_LIMITS[planTier];
}

export function canExportPdf(planTier: PlanTier): boolean {
  return planTier === "STANDARD";
}

export function canUseBulkImportExport(planTier: PlanTier): boolean {
  return planTier === "STANDARD";
}

export function canUseEmbed(planTier: PlanTier): boolean {
  return planTier === "STANDARD";
}

export function canUsePublicVisibility(planTier: PlanTier): boolean {
  return planTier === "STANDARD";
}
