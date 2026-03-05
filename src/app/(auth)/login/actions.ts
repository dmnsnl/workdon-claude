"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/session";

export type LoginState = {
  errors?: Record<string, string>;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  const result = authSchema.safeParse(raw);
  if (!result.success) {
    return { errors: { form: "Invalid email or password." } };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { errors: { form: "Invalid email or password." } };
  }

  await createUserSession(user.id);

  if (user.accountType === "COMPANY") {
    redirect("/app");
  } else {
    redirect("/my");
  }
}
