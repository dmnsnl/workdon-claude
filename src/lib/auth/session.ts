import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Company, PersonalProfile, User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "workdon_session";
const SESSION_DAYS = 14;

export type CompanyAuthContext = {
  user: User;
  company: Company;
  accountType: "COMPANY";
};

export type PersonalAuthContext = {
  user: User;
  personalProfile: PersonalProfile;
  accountType: "PERSONAL";
};

export type AuthContext = CompanyAuthContext | PersonalAuthContext;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.session.create({
    data: { tokenHash, userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroyUserSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          company: true,
          personalProfile: true,
        },
      },
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  const { user } = session;

  if (user.accountType === "COMPANY" && user.company) {
    return { user, company: user.company, accountType: "COMPANY" };
  }

  if (user.accountType === "PERSONAL" && user.personalProfile) {
    return {
      user,
      personalProfile: user.personalProfile,
      accountType: "PERSONAL",
    };
  }

  return null;
}

export async function requireCompanyAuth(): Promise<CompanyAuthContext> {
  const auth = await getAuthContext();
  if (!auth || auth.accountType !== "COMPANY") {
    redirect("/login");
  }
  return auth;
}

export async function requirePersonalAuth(): Promise<PersonalAuthContext> {
  const auth = await getAuthContext();
  if (!auth || auth.accountType !== "PERSONAL") {
    redirect("/login");
  }
  return auth;
}

export async function requireAnyAuth(): Promise<AuthContext> {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }
  return auth;
}
