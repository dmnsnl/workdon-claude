import type {
  CreditEntityType,
  CreditRoleCategory,
  ProjectCredit,
  ProjectMedia,
  StakeholderRole,
} from "@/generated/prisma/client";

// ─── Parsing helpers ─────────────────────────────────────

export function parseStructuredLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseStakeholderLines(
  input: string
): Array<{
  role: StakeholderRole;
  name: string;
  companyName?: string;
}> {
  return parseStructuredLines(input)
    .map((line) => {
      const [roleRaw, nameRaw, companyRaw] = line
        .split("|")
        .map((p) => p.trim());
      const name = nameRaw || "";
      if (!name) return null;

      return {
        role: toStakeholderRole(roleRaw),
        name,
        companyName: companyRaw || undefined,
      };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
}

export function parseCreditLines(
  input: string
): Array<{
  roleCategory: CreditRoleCategory;
  tradeGroup?: string;
  entityType: CreditEntityType;
  entityName: string;
  linkedCompanySlug?: string;
  sortOrder: number;
}> {
  return parseStructuredLines(input)
    .map((line, index) => {
      const [roleRaw, tradeRaw, typeRaw, nameRaw, linkedRaw] = line
        .split("|")
        .map((p) => p.trim());
      if (!nameRaw) return null;

      return {
        roleCategory: toCreditRoleCategory(roleRaw),
        tradeGroup: tradeRaw || undefined,
        entityType: (typeRaw === "PERSON" ? "PERSON" : "BUSINESS") as CreditEntityType,
        entityName: nameRaw,
        linkedCompanySlug: linkedRaw || undefined,
        sortOrder: index + 1,
      };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
}

export function parseOwnerMediaLines(
  input: string
): Array<{
  mediaType: ProjectMedia["mediaType"];
  url: string;
  caption?: string;
}> {
  return parseStructuredLines(input)
    .map((line) => {
      const [typeRaw, urlRaw, captionRaw] = line
        .split("|")
        .map((p) => p.trim());
      if (!urlRaw) return null;

      return {
        mediaType: (typeRaw === "VIDEO" ? "VIDEO" : "IMAGE") as ProjectMedia["mediaType"],
        url: urlRaw,
        caption: captionRaw || undefined,
      };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
}

// ─── Enum converters ─────────────────────────────────────

function toStakeholderRole(value: string): StakeholderRole {
  const n = value.toUpperCase();
  if (
    ["CLIENT", "ARCHITECT", "BUILDER", "ENGINEER", "CONSTRUCTION_MANAGER"].includes(n)
  ) {
    return n as StakeholderRole;
  }
  return "OTHER";
}

function toCreditRoleCategory(value: string): CreditRoleCategory {
  const n = value.toUpperCase();
  if (
    ["CONSTRUCTION_MANAGER", "ARCHITECT", "BUILDER", "ENGINEER", "SUBCONTRACTOR"].includes(n)
  ) {
    return n as CreditRoleCategory;
  }
  return "OTHER";
}

// ─── Credit ordering ─────────────────────────────────────

const CREDIT_PRIORITY: Record<CreditRoleCategory, number> = {
  CONSTRUCTION_MANAGER: 1,
  ARCHITECT: 2,
  BUILDER: 3,
  ENGINEER: 4,
  SUBCONTRACTOR: 5,
  OTHER: 6,
};

type CreditLike = Pick<
  ProjectCredit,
  "roleCategory" | "tradeGroup" | "sortOrder" | "entityName"
>;

export function orderCreditsByImportance<T extends CreditLike>(
  credits: T[]
): T[] {
  return [...credits].sort((a, b) => {
    const byCategory =
      CREDIT_PRIORITY[a.roleCategory] - CREDIT_PRIORITY[b.roleCategory];
    if (byCategory !== 0) return byCategory;

    if (
      a.roleCategory === "SUBCONTRACTOR" &&
      b.roleCategory === "SUBCONTRACTOR"
    ) {
      const tradeA = a.tradeGroup ?? "zzz";
      const tradeB = b.tradeGroup ?? "zzz";
      const tradeCompare = tradeA.localeCompare(tradeB);
      if (tradeCompare !== 0) return tradeCompare;
    }

    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;

    return a.entityName.localeCompare(b.entityName);
  });
}

// ─── Label helpers ───────────────────────────────────────

export function stakeholderLabel(role: StakeholderRole): string {
  return role.replaceAll("_", " ");
}

export function creditCategoryLabel(category: CreditRoleCategory): string {
  return category.replaceAll("_", " ");
}

export function budgetBandLabel(band: string): string {
  const labels: Record<string, string> = {
    UNDER_1M: "Under $1M",
    FROM_1M_TO_10M: "$1M – $10M",
    FROM_10M_TO_50M: "$10M – $50M",
    OVER_50M: "Over $50M",
  };
  return labels[band] ?? band;
}
