import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { creditCategoryLabel } from "@/lib/project-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}): Promise<Metadata> {
  const { profileSlug } = await params;
  const profile = await prisma.personalProfile.findUnique({
    where: { slug: profileSlug },
  });
  if (!profile) return { title: "Not Found" };
  return {
    title: profile.fullName,
    description:
      profile.headline ||
      `${profile.fullName} on WorkdOn — construction professional`,
  };
}

export default async function PersonalProfilePage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const [profile, linkedCredits] = await Promise.all([
    prisma.personalProfile.findUnique({
      where: { slug: profileSlug },
      include: {
        roleExperiences: {
          orderBy: [{ isCurrent: "desc" }, { startYear: "desc" }],
          include: {
            linkedCompany: { select: { name: true, slug: true } },
          },
        },
        projectExperiences: {
          orderBy: { createdAt: "desc" },
          include: {
            project: {
              select: {
                title: true,
                slug: true,
                publishStatus: true,
                isConfidential: true,
              },
            },
          },
        },
      },
    }),
    // Project credits linked to this profile
    prisma.projectCredit.findMany({
      where: {
        linkedPersonalProfile: { slug: profileSlug },
      },
      include: {
        project: {
          select: {
            title: true,
            slug: true,
            location: true,
            completionYear: true,
            heroImageUrl: true,
            publishStatus: true,
            isConfidential: true,
            company: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!profile) notFound();

  // Filter to only show credits for public projects
  const publicCredits = linkedCredits.filter(
    (c) =>
      c.project.publishStatus === "PUBLIC" && !c.project.isConfidential
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
              {profile.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.fullName}
            </h1>
            {profile.headline && (
              <p className="mt-1 text-lg text-muted-foreground">
                {profile.headline}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {profile.roleTitle && <span>{profile.roleTitle}</span>}
              {profile.location && (
                <>
                  {profile.roleTitle && <span>&middot;</span>}
                  <span>{profile.location}</span>
                </>
              )}
              {profile.yearsExperience > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{profile.yearsExperience} years experience</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">About</h2>
              <p className="mt-2 whitespace-pre-line text-muted-foreground">
                {profile.bio}
              </p>
            </section>
          </>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Project Credits */}
        {publicCredits.length > 0 && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">
                Project Credits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Credited on {publicCredits.length} public project
                {publicCredits.length !== 1 ? "s" : ""}
              </p>
              <div className="mt-4 space-y-3">
                {publicCredits.map((credit) => (
                  <Card key={credit.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            <Link
                              href={`/projects/${credit.project.slug}`}
                              className="hover:underline"
                            >
                              {credit.project.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            <Link
                              href={`/c/${credit.project.company.slug}`}
                              className="hover:underline"
                            >
                              {credit.project.company.name}
                            </Link>{" "}
                            &middot; {credit.project.location} &middot;{" "}
                            {credit.project.completionYear}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-xs">
                            {creditCategoryLabel(credit.roleCategory)}
                          </Badge>
                          {credit.isVerified && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {credit.tradeGroup && (
                      <CardContent>
                        <Badge variant="outline" className="text-xs">
                          {credit.tradeGroup}
                        </Badge>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Experience */}
        {profile.roleExperiences.length > 0 && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">Experience</h2>
              <div className="mt-4 space-y-3">
                {profile.roleExperiences.map((exp) => (
                  <Card key={exp.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {exp.roleTitle}
                      </CardTitle>
                      <CardDescription>
                        {exp.linkedCompany ? (
                          <Link
                            href={`/c/${exp.linkedCompany.slug}`}
                            className="hover:underline"
                          >
                            {exp.linkedCompany.name}
                          </Link>
                        ) : (
                          exp.companyName
                        )}{" "}
                        &middot; {exp.startYear} &ndash;{" "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endYear || ""}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Project experience */}
        {profile.projectExperiences.length > 0 && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">
                Project Experience
              </h2>
              <div className="mt-4 space-y-3">
                {profile.projectExperiences.map((exp) => {
                  const isPublicProject =
                    exp.project &&
                    exp.project.publishStatus === "PUBLIC" &&
                    !exp.project.isConfidential;
                  return (
                    <Card key={exp.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {isPublicProject ? (
                            <Link
                              href={`/projects/${exp.project!.slug}`}
                              className="hover:underline"
                            >
                              {exp.projectName}
                            </Link>
                          ) : (
                            exp.projectName
                          )}
                        </CardTitle>
                        {exp.roleTitle && (
                          <CardDescription>{exp.roleTitle}</CardDescription>
                        )}
                      </CardHeader>
                      {exp.contribution && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {exp.contribution}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Certificates & Education */}
        {(profile.certificates.length > 0 || profile.education) && (
          <>
            <Separator className="my-6" />
            <section>
              <h2 className="text-lg font-bold tracking-tight">
                Education &amp; Certifications
              </h2>
              {profile.education && (
                <p className="mt-2 text-muted-foreground">
                  {profile.education}
                </p>
              )}
              {profile.certificates.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.certificates.map((cert) => (
                    <Badge key={cert} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
