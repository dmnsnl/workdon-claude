"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { companyRegistrationSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";

export type RegisterState = {
  errors?: Record<string, string>;
};

export async function registerCompanyAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    companyName: String(formData.get("companyName") || "").trim(),
    companySlug: String(formData.get("companySlug") || "").trim(),
    ownerName: String(formData.get("ownerName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  const result = companyRegistrationSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  const { companyName, companySlug, ownerName, email, password } = result.data;

  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingEmail) {
    return { errors: { email: "An account with this email already exists." } };
  }

  const existingSlug = await prisma.company.findUnique({
    where: { slug: companySlug },
  });
  if (existingSlug) {
    return { errors: { companySlug: "This URL slug is already taken." } };
  }

  const passwordHash = await hashPassword(password);

  const company = await prisma.company.create({
    data: {
      name: companyName,
      slug: companySlug,
      users: {
        create: {
          email: email.toLowerCase(),
          passwordHash,
          name: ownerName,
          accountType: "COMPANY",
          companyRole: "OWNER",
        },
      },
    },
    include: { users: true },
  });

  await createUserSession(company.users[0].id);
  redirect("/app");
}
