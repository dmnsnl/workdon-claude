import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteProfileAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilesPage() {
  const auth = await requireCompanyAuth();

  const profiles = await prisma.capabilityProfile.findMany({
    where: { companyId: auth.company.id },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Capability Profiles
          </h1>
          <p className="text-muted-foreground">
            Curate shareable profiles to showcase your services and projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/profiles/new">New profile</Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No capability profiles yet. Create one to build a shareable
              showcase.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    <Link
                      href={`/app/profiles/${profile.id}`}
                      className="hover:underline"
                    >
                      {profile.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {profile._count.items} items &middot;{" "}
                    <span className="font-mono text-xs">
                      /p/{profile.slug}
                    </span>
                  </CardDescription>
                  <div className="flex gap-1.5 pt-1">
                    <Badge
                      variant={
                        profile.visibility === "PUBLIC"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {profile.visibility === "PUBLIC" ? "Public" : "Unlisted"}
                    </Badge>
                    {profile.includeConfidential && (
                      <Badge variant="outline">Incl. confidential</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/profiles/${profile.id}`}>Edit</Link>
                  </Button>
                  <form action={deleteProfileAction}>
                    <input
                      type="hidden"
                      name="profileId"
                      value={profile.id}
                    />
                    <Button variant="ghost" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
