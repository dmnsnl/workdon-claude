"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";
import { requireCompanyAuth } from "@/lib/auth/session";
import { enforcePublicServiceLimit } from "@/lib/plan-enforcement";
import { formString, formBoolean } from "@/lib/forms";
import { parseStringArray } from "@/lib/validation";

export type ServiceFormState = {
  errors?: Record<string, string>;
};

export async function createServiceAction(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const auth = await requireCompanyAuth();

  const raw = {
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    tags: parseStringArray(formString(formData, "tags")),
    publishStatus: formString(formData, "publishStatus") || "INTERNAL",
    isConfidential: formBoolean(formData, "isConfidential"),
  };

  const result = serviceSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  if (result.data.publishStatus === "PUBLIC") {
    try {
      await enforcePublicServiceLimit(auth.company.id, auth.company.planTier);
    } catch {
      return {
        errors: {
          publishStatus:
            "You've reached your plan limit for public services. Upgrade to add more.",
        },
      };
    }
  }

  await prisma.service.create({
    data: {
      companyId: auth.company.id,
      ...result.data,
    },
  });

  redirect("/app/services");
}

export async function updateServiceAction(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const auth = await requireCompanyAuth();
  const serviceId = formString(formData, "serviceId");

  const service = await prisma.service.findFirst({
    where: { id: serviceId, companyId: auth.company.id },
  });
  if (!service) {
    return { errors: { form: "Service not found." } };
  }

  const raw = {
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    tags: parseStringArray(formString(formData, "tags")),
    publishStatus: formString(formData, "publishStatus") || "INTERNAL",
    isConfidential: formBoolean(formData, "isConfidential"),
  };

  const result = serviceSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  if (
    result.data.publishStatus === "PUBLIC" &&
    service.publishStatus !== "PUBLIC"
  ) {
    try {
      await enforcePublicServiceLimit(
        auth.company.id,
        auth.company.planTier,
        serviceId
      );
    } catch {
      return {
        errors: {
          publishStatus:
            "You've reached your plan limit for public services.",
        },
      };
    }
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: result.data,
  });

  redirect("/app/services");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const auth = await requireCompanyAuth();
  const serviceId = formString(formData, "serviceId");

  await prisma.service.deleteMany({
    where: { id: serviceId, companyId: auth.company.id },
  });

  revalidatePath("/app/services");
}
