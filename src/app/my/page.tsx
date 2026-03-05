import { requirePersonalAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PersonalDashboardPage() {
  const auth = await requirePersonalAuth();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>{auth.personalProfile.fullName}</CardTitle>
            <CardDescription>
              {auth.personalProfile.headline || "Personal profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your public profile is live at{" "}
              <span className="font-mono text-foreground">
                /people/{auth.personalProfile.slug}
              </span>
            </p>
            <form action="/api/auth/logout" method="POST">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
