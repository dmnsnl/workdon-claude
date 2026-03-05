export interface LocationOption {
  suburb: string;
  state: string;
  country: string;
  label: string;
}

export const LOCATIONS: readonly LocationOption[] = [
  { suburb: "Sydney", state: "NSW", country: "AU", label: "Sydney, NSW" },
  { suburb: "Melbourne", state: "VIC", country: "AU", label: "Melbourne, VIC" },
  { suburb: "Brisbane", state: "QLD", country: "AU", label: "Brisbane, QLD" },
  { suburb: "Perth", state: "WA", country: "AU", label: "Perth, WA" },
  { suburb: "Adelaide", state: "SA", country: "AU", label: "Adelaide, SA" },
  { suburb: "Gold Coast", state: "QLD", country: "AU", label: "Gold Coast, QLD" },
  { suburb: "Hobart", state: "TAS", country: "AU", label: "Hobart, TAS" },
  { suburb: "Canberra", state: "ACT", country: "AU", label: "Canberra, ACT" },
  { suburb: "Auckland", state: "", country: "NZ", label: "Auckland, NZ" },
  { suburb: "Wellington", state: "", country: "NZ", label: "Wellington, NZ" },
  { suburb: "London", state: "", country: "UK", label: "London, UK" },
  { suburb: "Manchester", state: "", country: "UK", label: "Manchester, UK" },
  { suburb: "Los Angeles", state: "", country: "USA", label: "Los Angeles, USA" },
  { suburb: "New York", state: "", country: "USA", label: "New York, USA" },
];

export const SECTORS = [
  "Architecture",
  "Civil",
  "Commercial",
  "Community",
  "Consulting",
  "Development",
  "Education",
  "Engineering",
  "Government",
  "Health",
  "Infrastructure",
  "Mixed-Use",
  "Project Management",
  "Residential",
  "Subcontracting",
  "Sustainability",
] as const;

export const TRADES = [
  "General Construction",
  "Civil Engineering",
  "Fitout",
  "High-Rise",
  "Tiling",
  "Waterproofing",
  "Roofing",
  "Metal Cladding",
  "Plastering",
  "Rendering",
  "Structural Steel",
  "Fabrication",
  "Electrical",
  "Fire Protection",
  "Plumbing",
  "Hydraulic Services",
  "Architecture",
  "Interior Design",
  "Structural Engineering",
  "ESD Consulting",
  "Project Management",
  "Property Development",
  "Government Infrastructure",
  "Community Development",
] as const;

export const BUDGET_BANDS = [
  { value: "UNDER_1M", label: "Under $1M" },
  { value: "FROM_1M_TO_10M", label: "$1M – $10M" },
  { value: "FROM_10M_TO_50M", label: "$10M – $50M" },
  { value: "OVER_50M", label: "Over $50M" },
] as const;

export const EXPERIENCE_RANGES = [
  { value: "0-5", label: "0–5 years", min: 0, max: 5 },
  { value: "5-10", label: "5–10 years", min: 5, max: 10 },
  { value: "10-20", label: "10–20 years", min: 10, max: 20 },
  { value: "20+", label: "20+ years", min: 20, max: 100 },
] as const;
