const COUNTRY_NAMES: Record<string, string> = {
  AU: "Australia",
  NZ: "New Zealand",
  UK: "United Kingdom",
  USA: "United States",
};

const AU_STATES = new Set([
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
]);

export interface AddressFields {
  streetAddress?: string | null;
  suburb: string;
  state: string;
  postcode?: string | null;
  country: string;
}

/**
 * Short format for cards, search results, badges.
 * AU: "Brisbane, QLD"
 * Non-AU: "London, UK"
 */
export function formatLocationShort(
  addr: Pick<AddressFields, "suburb" | "state" | "country">
): string {
  if (addr.country === "AU" && addr.state) {
    return `${addr.suburb}, ${addr.state}`;
  }
  return `${addr.suburb}, ${addr.country}`;
}

/**
 * Full format for detail pages.
 * "123 Eagle St, Brisbane CBD, QLD 4000, Australia"
 */
export function formatLocationFull(addr: AddressFields): string {
  const parts: string[] = [];
  if (addr.streetAddress) parts.push(addr.streetAddress);
  parts.push(addr.suburb);
  if (addr.state && addr.postcode) {
    parts.push(`${addr.state} ${addr.postcode}`);
  } else if (addr.state) {
    parts.push(addr.state);
  } else if (addr.postcode) {
    parts.push(addr.postcode);
  }
  const countryName = COUNTRY_NAMES[addr.country] || addr.country;
  parts.push(countryName);
  return parts.join(", ");
}

export { AU_STATES, COUNTRY_NAMES };
