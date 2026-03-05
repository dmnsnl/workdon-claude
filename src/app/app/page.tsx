import Link from "next/link";
import { requireCompanyAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const auth = await requireCompanyAuth();

  const [serviceCount, projectCount, profileCount] = await Promise.all([
    prisma.service.count({ where: { companyId: auth.company.id } }),
    prisma.project.count({ where: { companyId: auth.company.id } }),
    prisma.capabilityProfile.count({ where: { companyId: auth.company.id } }),
  ]);

  const stats = [
    { label: "Services", count: serviceCount, href: "/app/services" },
    { label: "Projects", count: projectCount, href: "/app/projects" },
    {
      label: "Capability Profiles",
      count: profileCount,
      href: "/app/profiles",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back, {auth.user.name}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-foreground/20 transition-colors">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.count}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your {stat.label.toLowerCase()} &rarr;
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
