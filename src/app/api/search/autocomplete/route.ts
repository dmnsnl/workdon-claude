import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatLocationShort } from "@/lib/location";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const where = { contains: q, mode: "insensitive" as const };

    const [projects, companies, people] = await Promise.all([
      prisma.project.findMany({
        where: {
          publishStatus: "PUBLIC",
          isConfidential: false,
          OR: [{ title: where }, { suburb: where }],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          suburb: true,
          state: true,
          country: true,
        },
        orderBy: { viewCount: "desc" },
        take: 3,
      }),
      prisma.company.findMany({
        where: {
          OR: [{ name: where }, { suburb: where }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          suburb: true,
          state: true,
          country: true,
        },
        orderBy: { viewCount: "desc" },
        take: 3,
      }),
      prisma.personalProfile.findMany({
        where: {
          OR: [{ fullName: where }, { headline: where }, { location: where }],
        },
        select: {
          id: true,
          fullName: true,
          slug: true,
          roleTitle: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    const results = [
      ...projects.map((p) => ({
        id: p.id,
        name: p.title,
        type: "Project" as const,
        href: `/projects/${p.slug}`,
        subtitle: formatLocationShort(p),
      })),
      ...companies.map((c) => ({
        id: c.id,
        name: c.name,
        type: "Business" as const,
        href: `/c/${c.slug}`,
        subtitle: c.suburb
          ? formatLocationShort({ suburb: c.suburb, state: c.state || "", country: c.country })
          : null,
      })),
      ...people.map((p) => ({
        id: p.id,
        name: p.fullName,
        type: "Person" as const,
        href: `/people/${p.slug}`,
        subtitle: p.roleTitle,
      })),
    ].slice(0, 5);

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
