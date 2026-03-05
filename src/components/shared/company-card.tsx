import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatLocationShort } from "@/lib/location";

interface CompanyCardProps {
  slug: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  suburb: string | null;
  state: string | null;
  country: string;
  sectors: string[];
  projectCount?: number;
  viewCount?: number;
}

export function CompanyCard({
  slug,
  name,
  logoUrl,
  primaryColor,
  suburb,
  state,
  country,
  sectors,
  projectCount,
  viewCount,
}: CompanyCardProps) {
  return (
    <Link href={`/c/${slug}`}>
      <Card className="h-full hover:border-foreground/20 transition-colors">
        <CardHeader>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded text-sm font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <CardTitle className="text-base truncate">{name}</CardTitle>
              {suburb && (
                <CardDescription className="truncate">
                  {formatLocationShort({ suburb, state: state || "", country })}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {typeof projectCount === "number" && (
            <p className="text-sm text-muted-foreground">
              {projectCount} project{projectCount !== 1 ? "s" : ""}
            </p>
          )}
          {sectors.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {sectors.slice(0, 3).map((s) => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          {typeof viewCount === "number" && viewCount > 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {viewCount.toLocaleString()} views
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
