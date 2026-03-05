import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { budgetBandLabel } from "@/lib/project-details";

interface ProjectCardProps {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  location: string;
  completionYear: number;
  budgetBand: string;
  sectorTags: string[];
  companyName?: string;
  viewCount?: number;
}

export function ProjectCard({
  slug,
  title,
  heroImageUrl,
  location,
  completionYear,
  budgetBand,
  sectorTags,
  companyName,
  viewCount,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <Card className="h-full hover:border-foreground/20 transition-colors">
        {heroImageUrl && (
          <div className="aspect-[16/9] overflow-hidden rounded-t-xl bg-muted">
            <img
              src={heroImageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
          <CardDescription>
            {companyName && <>{companyName} &middot; </>}
            {location} &middot; {completionYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {budgetBandLabel(budgetBand)}
            </Badge>
            {sectorTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {typeof viewCount === "number" && viewCount > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {viewCount.toLocaleString()} views
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
