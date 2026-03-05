"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { companySettingsSchema } from "@/lib/validation";
import { requireCompanyAuth } from "@/lib/auth/session";
import { formString } from "@/lib/forms";
import { parseStringArray } from "@/lib/validation";

export type SettingsFormState = {
  errors?: Record<string, string>;
  success?: boolean;
};

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const auth = await requireCompanyAuth();

  const raw = {
    name: formString(formData, "name"),
    description: formString(formData, "description") || undefined,
    website: formString(formData, "website") || undefined,
    phone: formString(formData, "phone") || undefined,
    email: formString(formData, "email") || undefined,
    streetAddress: formString(formData, "streetAddress") || undefined,
    suburb: formString(formData, "suburb") || undefined,
    state: formString(formData, "state") || undefined,
    postcode: formString(formData, "postcode") || undefined,
    country: formString(formData, "country") || "AU",
    primaryColor: formString(formData, "primaryColor") || "#0f172a",
    sectors: parseStringArray(formString(formData, "sectors")),
    trades: parseStringArray(formString(formData, "trades")),
  };

  const result = companySettingsSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  await prisma.company.update({
    where: { id: auth.company.id },
    data: result.data,
  });

  revalidatePath("/app/settings");
  revalidatePath("/app");
  return { success: true };
}
