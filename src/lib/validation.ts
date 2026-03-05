import { z } from "zod/v4";

export const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const companyRegistrationSchema = z.object({
  companyName: z.string().min(2).max(200),
  companySlug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  email: z.email(),
  password: z.string().min(8).max(128),
  ownerName: z.string().min(2).max(200),
});

export const personalRegistrationSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.email(),
  password: z.string().min(8).max(128),
  headline: z.string().max(300).optional(),
  location: z.string().max(200).optional(),
});

export const companySettingsSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  website: z.url().optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  email: z.email().optional().or(z.literal("")),
  streetAddress: z.string().max(200).optional(),
  suburb: z.string().max(200).optional(),
  state: z.string().max(10).optional(),
  postcode: z.string().max(10).optional(),
  country: z.string().max(10).default("AU"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  sectors: z.array(z.string()).default([]),
  trades: z.array(z.string()).default([]),
});

export const serviceSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(2).max(10000),
  tags: z.array(z.string()).default([]),
  publishStatus: z.enum(["PUBLIC", "INTERNAL"]),
  isConfidential: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  client: z.string().max(200).optional(),
  streetAddress: z.string().max(200).optional(),
  suburb: z.string().min(1).max(200),
  state: z.string().max(10).default(""),
  postcode: z.string().max(10).optional(),
  country: z.string().min(1).max(10).default("AU"),
  sectorTags: z.array(z.string()).default([]),
  completionYear: z.number().int().min(1900).max(2100),
  budgetBand: z
    .enum(["UNDER_1M", "FROM_1M_TO_10M", "FROM_10M_TO_50M", "OVER_50M"])
    .default("FROM_1M_TO_10M"),
  scopeSummary: z.string().min(2).max(5000),
  caseStudy: z.string().max(20000).optional(),
  heroImageUrl: z.url().optional().or(z.literal("")),
  publishStatus: z.enum(["PUBLIC", "INTERNAL"]),
  isConfidential: z.boolean().default(false),
});

export const capabilityProfileSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  introText: z.string().max(5000).default(""),
  visibility: z.enum(["PUBLIC", "UNLISTED"]),
  includeConfidential: z.boolean().default(false),
  template: z.enum(["TEMPLATE_A", "TEMPLATE_B", "TEMPLATE_C"]),
});

export const personalProfileSchema = z.object({
  fullName: z.string().min(2).max(200),
  headline: z.string().max(300).optional(),
  bio: z.string().max(5000).default(""),
  roleTitle: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  yearsExperience: z.number().int().min(0).max(80).default(0),
  education: z.string().max(2000).optional(),
  certificates: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

export const roleExperienceSchema = z.object({
  companyName: z.string().min(1).max(200),
  linkedCompanyId: z.string().optional(),
  roleTitle: z.string().min(1).max(200),
  startYear: z.number().int().min(1950).max(2100),
  endYear: z.number().int().min(1950).max(2100).optional(),
  isCurrent: z.boolean().default(false),
});

export const personalProjectExperienceSchema = z.object({
  projectName: z.string().min(1).max(200),
  projectId: z.string().optional(),
  roleTitle: z.string().max(200).default(""),
  contribution: z.string().max(5000).optional(),
});

export function parseStringArray(input: string): string[] {
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseTextareaLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
