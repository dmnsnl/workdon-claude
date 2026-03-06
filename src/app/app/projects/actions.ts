"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";
import { requireCompanyAuth } from "@/lib/auth/session";
import { enforcePublicProjectLimit } from "@/lib/plan-enforcement";
import { formString, formBoolean, formInteger } from "@/lib/forms";
import { parseStringArray } from "@/lib/validation";

export type ProjectFormState = {
  errors?: Record<string, string>;
};

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const auth = await requireCompanyAuth();

  const raw = {
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    client: formString(formData, "client") || undefined,
    streetAddress: formString(formData, "streetAddress") || undefined,
    suburb: formString(formData, "suburb"),
    state: formString(formData, "state") || "",
    postcode: formString(formData, "postcode") || undefined,
    country: formString(formData, "country") || "AU",
    sectorTags: parseStringArray(formString(formData, "sectorTags")),
    completionYear: formInteger(formData, "completionYear", 2024),
    budgetBand: formString(formData, "budgetBand") || "FROM_1M_TO_10M",
    scopeSummary: formString(formData, "scopeSummary"),
    caseStudy: formString(formData, "caseStudy") || undefined,
    heroImageUrl: formString(formData, "heroImageUrl") || undefined,
    publishStatus: formString(formData, "publishStatus") || "INTERNAL",
    isConfidential: formBoolean(formData, "isConfidential"),
  };

  const result = projectSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  const existingSlug = await prisma.project.findUnique({
    where: { slug: result.data.slug },
  });
  if (existingSlug) {
    return { errors: { slug: "This project slug is already taken." } };
  }

  if (result.data.publishStatus === "PUBLIC") {
    try {
      await enforcePublicProjectLimit(auth.company.id, auth.company.planTier);
    } catch {
      return {
        errors: {
          publishStatus:
            "You've reached your plan limit for public projects. Upgrade to add more.",
        },
      };
    }
  }

  await prisma.project.create({
    data: {
      companyId: auth.company.id,
      ...result.data,
      heroImageUrl: result.data.heroImageUrl || null,
    },
  });

  redirect("/app/projects");
}

export async function updateProjectAction(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const auth = await requireCompanyAuth();
  const projectId = formString(formData, "projectId");

  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId: auth.company.id },
  });
  if (!project) {
    return { errors: { form: "Project not found." } };
  }

  const raw = {
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    client: formString(formData, "client") || undefined,
    streetAddress: formString(formData, "streetAddress") || undefined,
    suburb: formString(formData, "suburb"),
    state: formString(formData, "state") || "",
    postcode: formString(formData, "postcode") || undefined,
    country: formString(formData, "country") || "AU",
    sectorTags: parseStringArray(formString(formData, "sectorTags")),
    completionYear: formInteger(formData, "completionYear", 2024),
    budgetBand: formString(formData, "budgetBand") || "FROM_1M_TO_10M",
    scopeSummary: formString(formData, "scopeSummary"),
    caseStudy: formString(formData, "caseStudy") || undefined,
    heroImageUrl: formString(formData, "heroImageUrl") || undefined,
    publishStatus: formString(formData, "publishStatus") || "INTERNAL",
    isConfidential: formBoolean(formData, "isConfidential"),
  };

  const result = projectSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  if (result.data.slug !== project.slug) {
    const existingSlug = await prisma.project.findUnique({
      where: { slug: result.data.slug },
    });
    if (existingSlug) {
      return { errors: { slug: "This project slug is already taken." } };
    }
  }

  if (
    result.data.publishStatus === "PUBLIC" &&
    project.publishStatus !== "PUBLIC"
  ) {
    try {
      await enforcePublicProjectLimit(
        auth.company.id,
        auth.company.planTier,
        projectId
      );
    } catch {
      return {
        errors: {
          publishStatus:
            "You've reached your plan limit for public projects.",
        },
      };
    }
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      ...result.data,
      heroImageUrl: result.data.heroImageUrl || null,
    },
  });

  redirect("/app/projects");
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const auth = await requireCompanyAuth();
  const projectId = formString(formData, "projectId");

  await prisma.project.deleteMany({
    where: { id: projectId, companyId: auth.company.id },
  });

  revalidatePath("/app/projects");
}
