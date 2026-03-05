import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      projectCount,
      companyCount,
      profileCount,
      articleCount,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.company.count(),
      prisma.personalProfile.count(),
      prisma.article.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      counts: {
        projects: projectCount,
        companies: companyCount,
        profiles: profileCount,
        articles: articleCount,
      },
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbHost: process.env.DATABASE_URL
          ? new URL(process.env.DATABASE_URL).hostname
          : "not set",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
        env: {
          hasDbUrl: !!process.env.DATABASE_URL,
          dbHost: process.env.DATABASE_URL
            ? new URL(process.env.DATABASE_URL).hostname
            : "not set",
        },
      },
      { status: 500 }
    );
  }
}
