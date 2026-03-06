import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HeroSectorPills } from "./hero-sector-pills";
import { formatLocationShort } from "@/lib/location";
import { budgetBandLabel } from "@/lib/project-details";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HeroProject {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  suburb: string;
  state: string;
  country: string;
  sectorTags: string[];
  budgetBand: string;
  companyName: string;
}

interface HeroArticle {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  authorName: string;
}

export interface HeroSectionProps {
  featuredProject: HeroProject | null;
  secondProject: HeroProject | null;
  article: HeroArticle | null;
  avatarPeople: Array<{ fullName: string; profileImageUrl: string | null }>;
  stats: { projectCount: number; companyCount: number; peopleCount: number };
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "WorkdOn connected us with the right partners and helped us deliver ahead of schedule.",
    name: "Sarah Mitchell",
    role: "Project Director, Atlas Build",
  },
  {
    quote:
      "Finally a platform that gives credit to the people who actually build these projects.",
    name: "James Chen",
    role: "Site Manager, Horizon Construction",
  },
  {
    quote:
      "We've found incredible talent through WorkdOn that we never would have discovered otherwise.",
    name: "Emma Richardson",
    role: "Head of Operations, Meridian Group",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroSection({
  featuredProject,
  secondProject,
  article,
  avatarPeople,
  stats,
}: HeroSectionProps) {
  const testimonial =
    TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)];

  return (
    <section className="border-b bg-muted/20 pt-8 lg:pt-14 pb-8 lg:pb-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* ═══ TOP GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:min-h-[520px]">
          {/* ── Text Column (5 cols) ── */}
          <div className="lg:col-span-5 lg:row-span-2 flex flex-col justify-center text-center lg:text-left py-4 lg:py-0 lg:pr-4 lg:max-w-[380px]">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08]">
              For the people and teams who shape our cities.
            </h1>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground">
              Discover construction projects, companies, and the professionals
              behind them.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <Link
                href="/search"
                className="inline-flex items-center rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                Explore Projects
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
              >
                Join the Community
              </Link>
            </div>

            {/* Sector pills (wrapping, max 2 rows) */}
            <div className="mt-5 hidden sm:block">
              <HeroSectorPills />
            </div>

            {/* Avatar stack — extra spacing to separate from hero text */}
            {avatarPeople.length > 0 && (
              <div className="mt-8 pt-4 border-t flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  {avatarPeople.map((p, i) =>
                    p.profileImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={i}
                        src={p.profileImageUrl}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                      />
                    ) : (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground ring-2 ring-background"
                      >
                        {p.fullName.charAt(0)}
                      </div>
                    )
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join{" "}
                  <span className="font-semibold text-foreground">
                    {stats.peopleCount.toLocaleString()}+
                  </span>{" "}
                  professionals
                </p>
              </div>
            )}

            {/* Stats: Projects, Businesses, Project Value */}
            <div className="mt-4 hidden lg:flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold tabular-nums leading-none">
                  {stats.projectCount.toLocaleString()}+
                </p>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums leading-none">
                  {stats.companyCount.toLocaleString()}+
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Businesses
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums leading-none">
                  $89B+
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Project Value
                </p>
              </div>
            </div>
          </div>

          {/* ── Featured Project (4 cols) ── */}
          {featuredProject && (
            <Link
              href={`/projects/${featuredProject.slug}`}
              className="lg:col-span-4 lg:row-span-2 group"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px]">
                {featuredProject.heroImageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={featuredProject.heroImageUrl}
                    alt={featuredProject.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Featured badge */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-white"
                  >
                    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8L8 14 2 9.2h7.6z" />
                  </svg>
                  <span className="text-xs font-semibold text-white">
                    Featured Project
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-xs font-medium text-white/70">
                    {featuredProject.companyName}
                  </p>
                  <h3 className="mt-1 text-lg sm:text-xl font-bold text-white line-clamp-2">
                    {featuredProject.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge className="bg-white/20 text-white text-xs border-0 hover:bg-white/30">
                      {formatLocationShort(featuredProject)}
                    </Badge>
                    <Badge className="bg-white/20 text-white text-xs border-0 hover:bg-white/30">
                      {budgetBandLabel(featuredProject.budgetBand)}
                    </Badge>
                    {featuredProject.sectorTags.slice(0, 1).map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-white/20 text-white text-xs border-0 hover:bg-white/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Right column: Builders (taller) + Quote (shorter) ── */}
          <div className="lg:col-span-3 lg:row-span-2 flex flex-col gap-3">
            {/* Meet the Builders */}
            <Link href="/search?type=people" className="group flex-[3]">
              <div
                className="relative overflow-hidden rounded-xl h-full min-h-[180px] flex flex-col justify-end transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #d4ffc8 0%, #C9FFC1 50%, #b8f4ad 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/tradie-hero.png"
                  alt="Construction professional"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />

                <div className="relative p-5">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(0,0,0,0.55)" }}
                  >
                    Meet
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-bold leading-tight"
                    style={{ color: "rgba(0,0,0,0.9)" }}
                  >
                    The Builders
                  </h3>
                  <p
                    className="text-xs font-medium mt-0.5"
                    style={{ color: "rgba(0,0,0,0.55)" }}
                  >
                    Behind Every Project
                  </p>
                </div>
              </div>
            </Link>

            {/* Testimonial */}
            <div className="flex-[1]">
              <div className="rounded-xl border bg-background p-4 h-full flex flex-col">
                <p className="text-sm text-foreground/80 italic leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3">
          {/* Spacer under text column */}
          <div className="hidden lg:block lg:col-span-5" />

          {/* Browse Companies */}
          <Link
            href="/search?type=companies"
            className="sm:col-span-7 lg:col-span-4 group"
          >
            <div className="relative overflow-hidden rounded-xl bg-foreground p-5 h-full min-h-[130px] flex flex-col justify-end transition-opacity hover:opacity-90">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 mb-auto mt-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div>
                <h3 className="text-base font-bold text-background leading-snug">
                  Built by Teams.
                  <br />
                  Powered by People.
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Discover companies and the teams behind every project.
                </p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-background">
                  Browse Companies
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Article / Video */}
          {article && (
            <Link
              href={`/articles/${article.slug}`}
              className="sm:col-span-5 lg:col-span-3 group"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3] sm:aspect-auto sm:h-full min-h-[130px]">
                {article.heroImageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={article.heroImageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-white ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[10px] font-medium text-white/70">
                    {article.authorName}
                  </p>
                  <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Mobile stats */}
        <div className="flex lg:hidden items-center justify-around gap-4 mt-6 pt-4 border-t text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.projectCount.toLocaleString()}+
            </p>
            <p className="text-xs text-muted-foreground mt-1">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.companyCount.toLocaleString()}+
            </p>
            <p className="text-xs text-muted-foreground mt-1">Businesses</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">$89B+</p>
            <p className="text-xs text-muted-foreground mt-1">Project Value</p>
          </div>
        </div>
      </div>
    </section>
  );
}
