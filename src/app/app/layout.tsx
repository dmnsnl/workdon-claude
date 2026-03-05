import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireCompanyAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/app" className="font-bold tracking-tight">
              WorkdOn
            </Link>
            <nav className="hidden items-center gap-4 text-sm md:flex">
              <Link
                href="/app/services"
                className="text-muted-foreground hover:text-foreground"
              >
                Services
              </Link>
              <Link
                href="/app/projects"
                className="text-muted-foreground hover:text-foreground"
              >
                Projects
              </Link>
              <Link
                href="/app/profiles"
                className="text-muted-foreground hover:text-foreground"
              >
                Profiles
              </Link>
              <Link
                href="/app/settings"
                className="text-muted-foreground hover:text-foreground"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {auth.company.name}
            </span>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
