"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { personalRegistrationSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";
import { uniqueSlug } from "@/lib/slugs";

export type PersonalRegisterState = {
  errors?: Record<string, string>;
};

export async function registerPersonalAction(
  _prev: PersonalRegisterState,
  formData: FormData
): Promise<PersonalRegisterState> {
  const raw = {
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    headline: String(formData.get("headline") || "").trim() || undefined,
    location: String(formData.get("location") || "").trim() || undefined,
  };

  const result = personalRegistrationSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { errors: fieldErrors };
  }

  const { fullName, email, password, headline, location } = result.data;

  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingEmail) {
    return { errors: { email: "An account with this email already exists." } };
  }

  const passwordHash = await hashPassword(password);
  const slug = uniqueSlug(fullName);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: fullName,
      accountType: "PERSONAL",
      personalProfile: {
        create: {
          fullName,
          slug,
          headline,
          location,
        },
      },
    },
  });

  await createUserSession(user.id);
  redirect("/my");
}
