"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { capabilityProfileSchema } from "@/lib/validation";
import { requireCompanyAuth } from "@/lib/auth/session";
import {
  enforceProfileCountLimit,
  enforceProfileVisibility,
} from "@/lib/plan-enforcement";
import { formString, formBoolean } from "@/lib/forms";

export type ProfileFormState = {
  errors?: Record<string, string>;
};

export async function createProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const auth = await requireCompanyAuth();

  const raw = {
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    introText: formString(formData, "introText"),
    visibility: formString(formData, "visibility") || "UNLISTED",
    includeConfidential: formBoolean(formData, "includeConfidential"),
    template: formString(formData, "template") || "TEMPLATE_A",
  };

  const result = capabilityProfileSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  try {
    await enforceProfileCountLimit(auth.company.id, auth.company.planTier);
  } catch {
    return {
      errors: {
        form: "You've reached your plan limit for capability profiles.",
      },
    };
  }

  const existingSlug = await prisma.capabilityProfile.findUnique({
    where: { slug: result.data.slug },
  });
  if (existingSlug) {
    return { errors: { slug: "This profile slug is already taken." } };
  }

  const visibility = enforceProfileVisibility(
    auth.company.planTier,
    result.data.visibility
  );

  await prisma.capabilityProfile.create({
    data: {
      companyId: auth.company.id,
      ...result.data,
      visibility: visibility as "PUBLIC" | "UNLISTED",
    },
  });

  redirect("/app/profiles");
}

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const auth = await requireCompanyAuth();
  const profileId = formString(formData, "profileId");

  const profile = await prisma.capabilityProfile.findFirst({
    where: { id: profileId, companyId: auth.company.id },
  });
  if (!profile) {
    return { errors: { form: "Profile not found." } };
  }

  const raw = {
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    introText: formString(formData, "introText"),
    visibility: formString(formData, "visibility") || "UNLISTED",
    includeConfidential: formBoolean(formData, "includeConfidential"),
    template: formString(formData, "template") || "TEMPLATE_A",
  };

  const result = capabilityProfileSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  if (result.data.slug !== profile.slug) {
    const existingSlug = await prisma.capabilityProfile.findUnique({
      where: { slug: result.data.slug },
    });
    if (existingSlug) {
      return { errors: { slug: "This profile slug is already taken." } };
    }
  }

  const visibility = enforceProfileVisibility(
    auth.company.planTier,
    result.data.visibility
  );

  await prisma.capabilityProfile.update({
    where: { id: profileId },
    data: {
      ...result.data,
      visibility: visibility as "PUBLIC" | "UNLISTED",
    },
  });

  redirect("/app/profiles");
}

export async function deleteProfileAction(formData: FormData): Promise<void> {
  const auth = await requireCompanyAuth();
  const profileId = formString(formData, "profileId");

  await prisma.capabilityProfile.deleteMany({
    where: { id: profileId, companyId: auth.company.id },
  });

  revalidatePath("/app/profiles");
}

export async function updateProfileItemsAction(
  formData: FormData
): Promise<void> {
  const auth = await requireCompanyAuth();
  const profileId = formString(formData, "profileId");
  const itemsJson = formString(formData, "items");

  const profile = await prisma.capabilityProfile.findFirst({
    where: { id: profileId, companyId: auth.company.id },
  });
  if (!profile) return;

  const items: Array<{
    itemType: "SERVICE" | "PROJECT";
    serviceId?: string;
    projectId?: string;
    sortOrder: number;
  }> = JSON.parse(itemsJson || "[]");

  await prisma.$transaction([
    prisma.capabilityProfileItem.deleteMany({
      where: { profileId },
    }),
    ...items.map((item, index) =>
      prisma.capabilityProfileItem.create({
        data: {
          profileId,
          itemType: item.itemType,
          serviceId: item.itemType === "SERVICE" ? item.serviceId : null,
          projectId: item.itemType === "PROJECT" ? item.projectId : null,
          sortOrder: index,
        },
      })
    ),
  ]);

  revalidatePath(`/app/profiles/${profileId}`);
}
