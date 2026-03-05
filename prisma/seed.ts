import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// ─── Prisma Client Setup ────────────────────────────────

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── Helpers ─────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

let heroImageIndex = 0;
function nextHeroImage(): string {
  const url = HERO_IMAGES[heroImageIndex % HERO_IMAGES.length];
  heroImageIndex++;
  return url;
}

let mediaImageIndex = 0;
function nextMediaImage(): string {
  const url = MEDIA_IMAGES[mediaImageIndex % MEDIA_IMAGES.length];
  mediaImageIndex++;
  return url;
}

// ─── Constants ───────────────────────────────────────────

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=600&fit=crop",
];

const MEDIA_IMAGES = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
];

const MEDIA_CAPTIONS = [
  "Aerial construction progress",
  "Completed facade",
  "Interior fitout",
  "Structural framework",
  "Site panoramic view",
  "Foundation works",
  "Cladding installation",
  "Lobby entrance",
  "Rooftop completion",
  "Night-time exterior view",
];

const FIRST_NAMES = [
  "James", "Sarah", "Michael", "Emma", "David", "Jessica", "Daniel", "Emily",
  "Matthew", "Olivia", "Andrew", "Sophie", "Thomas", "Hannah", "William", "Charlotte",
  "Jack", "Grace", "Ryan", "Chloe", "Joshua", "Isabella", "Nathan", "Mia",
  "Luke", "Lily", "Liam", "Amelia", "Benjamin", "Ella", "Jake", "Zoe",
  "Ethan", "Ava", "Noah", "Harper", "Cooper", "Ruby", "Mason", "Willow",
  "Oliver", "Sienna", "Alexander", "Matilda", "Henry", "Phoebe", "Samuel", "Evie",
  "Finn", "Georgia",
];

const LAST_NAMES = [
  "Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White",
  "Martin", "Anderson", "Thompson", "Walker", "Harris", "Lee", "Clark", "Robinson",
  "Young", "Hall", "King", "Wright", "Mitchell", "Turner", "Roberts", "Scott",
  "Morgan", "Baker", "Campbell", "Stewart", "Kelly", "Murray", "Richardson", "Cooper",
  "Murphy", "Hughes", "O'Brien", "Collins", "Ward", "Walsh", "Sullivan", "McCarthy",
];

const SUBCONTRACTOR_TRADES = [
  "Tiling", "Electrical", "Plumbing", "Roofing", "Plastering", "Painting",
  "Concrete", "Formwork", "Glazing", "Landscaping", "HVAC", "Fire Protection",
  "Waterproofing", "Demolition", "Scaffolding", "Carpentry", "Joinery",
];

interface SeedLocation {
  suburb: string;
  state: string;
  country: string;
  label: string;
}

const AU_LOCATIONS: SeedLocation[] = [
  { suburb: "Sydney", state: "NSW", country: "AU", label: "Sydney, NSW" },
  { suburb: "Melbourne", state: "VIC", country: "AU", label: "Melbourne, VIC" },
  { suburb: "Brisbane", state: "QLD", country: "AU", label: "Brisbane, QLD" },
  { suburb: "Perth", state: "WA", country: "AU", label: "Perth, WA" },
  { suburb: "Adelaide", state: "SA", country: "AU", label: "Adelaide, SA" },
  { suburb: "Gold Coast", state: "QLD", country: "AU", label: "Gold Coast, QLD" },
  { suburb: "Hobart", state: "TAS", country: "AU", label: "Hobart, TAS" },
  { suburb: "Canberra", state: "ACT", country: "AU", label: "Canberra, ACT" },
];

const NZ_LOCATIONS: SeedLocation[] = [
  { suburb: "Auckland", state: "", country: "NZ", label: "Auckland, NZ" },
  { suburb: "Wellington", state: "", country: "NZ", label: "Wellington, NZ" },
];
const UK_LOCATIONS: SeedLocation[] = [
  { suburb: "London", state: "", country: "UK", label: "London, UK" },
  { suburb: "Manchester", state: "", country: "UK", label: "Manchester, UK" },
];
const US_LOCATIONS: SeedLocation[] = [
  { suburb: "Los Angeles", state: "", country: "USA", label: "Los Angeles, USA" },
  { suburb: "New York", state: "", country: "USA", label: "New York, USA" },
];

function randomProjectLocation(): SeedLocation {
  const r = Math.random();
  if (r < 0.70) return pick(AU_LOCATIONS);
  if (r < 0.80) return pick(NZ_LOCATIONS);
  if (r < 0.90) return pick(UK_LOCATIONS);
  return pick(US_LOCATIONS);
}

// ─── Trade-to-Company Slug Mapping ───────────────────────

const TRADE_TO_COMPANY_SLUG: Record<string, string> = {
  "Tiling": "protile-solutions",
  "Waterproofing": "protile-solutions",
  "Roofing": "apex-roofing-cladding",
  "Metal Cladding": "apex-roofing-cladding",
  "Plastering": "premier-plastering",
  "Rendering": "premier-plastering",
  "Structural Steel": "steelform-structural",
  "Fabrication": "steelform-structural",
  "Electrical": "elite-electrical-services",
  "Fire Protection": "elite-electrical-services",
  "Plumbing": "aquaflow-plumbing",
  "Hydraulic Services": "aquaflow-plumbing",
};

// ─── Company Definitions ─────────────────────────────────

interface CompanyDef {
  name: string;
  type: "tier1" | "midtier" | "subcontractor" | "consultant" | "developer" | "govclient";
  suburb: string;
  state: string;
  country: string;
  sectors: string[];
  trades: string[];
  primaryColor: string;
  description: string;
}

const COMPANIES: CompanyDef[] = [
  {
    name: "Westfield Build Group",
    type: "tier1",
    suburb: "Sydney", state: "NSW", country: "AU",
    sectors: ["Commercial", "Infrastructure"],
    trades: ["General Construction"],
    primaryColor: "#1a1a2e",
    description: "Westfield Build Group is one of Australia's leading Tier 1 construction firms, delivering landmark commercial and infrastructure projects across the eastern seaboard. With over 35 years of experience, the company has shaped Sydney's skyline with award-winning developments. Their commitment to innovation and safety excellence sets them apart in the Australian construction landscape.",
  },
  {
    name: "Paramount Constructions",
    type: "tier1",
    suburb: "Melbourne", state: "VIC", country: "AU",
    sectors: ["Commercial", "Residential"],
    trades: ["General Construction"],
    primaryColor: "#16213e",
    description: "Paramount Constructions is a Melbourne-based Tier 1 builder with a strong track record in commercial towers and premium residential developments. Known for delivering complex projects on time and within budget, they have earned multiple Master Builders Awards. Their portfolio includes some of Victoria's most recognisable buildings.",
  },
  {
    name: "Atlas Infrastructure Partners",
    type: "tier1",
    suburb: "Brisbane", state: "QLD", country: "AU",
    sectors: ["Infrastructure", "Civil"],
    trades: ["Civil Engineering"],
    primaryColor: "#0f3460",
    description: "Atlas Infrastructure Partners specialises in large-scale civil infrastructure projects across Queensland and northern Australia. From highway interchanges to bridge construction and tunnel works, they deliver critical public infrastructure with precision and reliability. They are a trusted partner for government and private sector clients alike.",
  },
  {
    name: "Coastal Building Co",
    type: "midtier",
    suburb: "Gold Coast", state: "QLD", country: "AU",
    sectors: ["Residential", "Commercial"],
    trades: ["General Construction", "Fitout"],
    primaryColor: "#2c3e50",
    description: "Coastal Building Co is a mid-tier construction company based on Queensland's Gold Coast, specialising in boutique residential complexes and commercial fitouts. Their hands-on approach and deep local knowledge have made them a preferred builder for coastal developments. They pride themselves on quality craftsmanship and strong client relationships.",
  },
  {
    name: "Southern Cross Constructions",
    type: "midtier",
    suburb: "Adelaide", state: "SA", country: "AU",
    sectors: ["Commercial", "Education"],
    trades: ["General Construction"],
    primaryColor: "#34495e",
    description: "Southern Cross Constructions is Adelaide's premier mid-tier builder, with a strong focus on commercial offices and educational facilities. Having delivered over 200 projects across South Australia, they bring deep regional expertise to every build. Their team is known for collaborative project delivery and community-focused construction.",
  },
  {
    name: "Harbour City Projects",
    type: "midtier",
    suburb: "Sydney", state: "NSW", country: "AU",
    sectors: ["Residential", "Mixed-Use"],
    trades: ["General Construction", "High-Rise"],
    primaryColor: "#2d3436",
    description: "Harbour City Projects delivers medium to large-scale residential and mixed-use developments across greater Sydney. With expertise in high-rise construction and urban renewal, they are transforming Sydney's suburban centres. Their integrated design-and-build approach ensures seamless project delivery.",
  },
  {
    name: "ProTile Solutions",
    type: "subcontractor",
    suburb: "Melbourne", state: "VIC", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Tiling", "Waterproofing"],
    primaryColor: "#636e72",
    description: "ProTile Solutions is Melbourne's trusted specialist in commercial and residential tiling and waterproofing. With a team of over 80 skilled tradespeople, they deliver precision tilework for projects ranging from luxury apartments to hospital refurbishments. Their waterproofing division ensures long-lasting protection for wet areas and podium levels.",
  },
  {
    name: "Apex Roofing & Cladding",
    type: "subcontractor",
    suburb: "Perth", state: "WA", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Roofing", "Metal Cladding"],
    primaryColor: "#4a4a4a",
    description: "Apex Roofing & Cladding provides expert roofing and metal cladding services across Western Australia. From industrial warehouses to premium residential projects, their team handles complex roof geometries and high-performance cladding systems. They are an approved installer for major Australian cladding manufacturers.",
  },
  {
    name: "Premier Plastering",
    type: "subcontractor",
    suburb: "Sydney", state: "NSW", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Plastering", "Rendering"],
    primaryColor: "#555555",
    description: "Premier Plastering is Sydney's leading plastering and rendering subcontractor, servicing Tier 1 and mid-tier builders across NSW. Their expert team handles everything from acoustic plasterboard systems to decorative render finishes. With a reputation for reliability and quality, they are a fixture on Sydney's biggest construction sites.",
  },
  {
    name: "Steelform Structural",
    type: "subcontractor",
    suburb: "Brisbane", state: "QLD", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Structural Steel", "Fabrication"],
    primaryColor: "#3d3d3d",
    description: "Steelform Structural is a Brisbane-based structural steel fabrication and erection specialist. They manufacture and install steel frameworks for commercial, industrial, and infrastructure projects throughout Queensland. Their in-house engineering team ensures precise fabrication and seamless site installation.",
  },
  {
    name: "Elite Electrical Services",
    type: "subcontractor",
    suburb: "Melbourne", state: "VIC", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Electrical", "Fire Protection"],
    primaryColor: "#4b4b4b",
    description: "Elite Electrical Services provides comprehensive electrical installation and fire protection systems for commercial and residential projects in Victoria. Their team of licensed electricians specialises in high-rise electrical distribution, data cabling, and integrated fire detection systems. They hold all relevant accreditations for essential services work.",
  },
  {
    name: "AquaFlow Plumbing",
    type: "subcontractor",
    suburb: "Adelaide", state: "SA", country: "AU",
    sectors: ["Subcontracting"],
    trades: ["Plumbing", "Hydraulic Services"],
    primaryColor: "#5a5a5a",
    description: "AquaFlow Plumbing delivers expert plumbing and hydraulic services across South Australia's construction industry. From multi-storey hydraulic risers to sustainable rainwater harvesting systems, their team handles the full spectrum of plumbing works. They are known for innovative solutions that reduce water consumption and building operating costs.",
  },
  {
    name: "Darling Architects",
    type: "consultant",
    suburb: "Sydney", state: "NSW", country: "AU",
    sectors: ["Architecture"],
    trades: ["Architecture", "Interior Design"],
    primaryColor: "#2c2c2c",
    description: "Darling Architects is an award-winning Sydney practice creating thoughtful, sustainable architecture across residential, commercial, and cultural sectors. Their designs respond to Australia's unique climate and urban context, blending modernist principles with practical liveability. They have won multiple Australian Institute of Architects awards.",
  },
  {
    name: "Structural Dynamics Engineering",
    type: "consultant",
    suburb: "Melbourne", state: "VIC", country: "AU",
    sectors: ["Engineering"],
    trades: ["Structural Engineering"],
    primaryColor: "#383838",
    description: "Structural Dynamics Engineering is a Melbourne-based structural engineering consultancy with expertise in complex building structures and seismic design. Their engineers work across high-rise residential, commercial towers, and heritage refurbishment projects. They use cutting-edge analysis software to optimise structural systems for efficiency and buildability.",
  },
  {
    name: "Green Leaf Sustainability",
    type: "consultant",
    suburb: "Brisbane", state: "QLD", country: "AU",
    sectors: ["Sustainability", "Consulting"],
    trades: ["ESD Consulting"],
    primaryColor: "#404040",
    description: "Green Leaf Sustainability is Queensland's leading ESD consultancy, helping builders and developers achieve Green Star, NABERS, and NatHERS ratings. Their team of accredited professionals provides energy modelling, daylight analysis, and materials lifecycle assessments. They have contributed to over 50 Green Star-rated projects across Australia.",
  },
  {
    name: "Pacific Project Management",
    type: "consultant",
    suburb: "Perth", state: "WA", country: "AU",
    sectors: ["Project Management"],
    trades: ["Project Management"],
    primaryColor: "#333333",
    description: "Pacific Project Management provides independent project management and superintendent services for construction projects across Western Australia. With experience spanning mining infrastructure, commercial developments, and government facilities, they ensure projects are delivered safely, on time, and within budget. Their team holds accreditation with the Australian Institute of Project Management.",
  },
  {
    name: "Horizon Property Group",
    type: "developer",
    suburb: "Sydney", state: "NSW", country: "AU",
    sectors: ["Development", "Residential"],
    trades: ["Property Development"],
    primaryColor: "#1a1a1a",
    description: "Horizon Property Group is a Sydney-based property developer focused on premium residential developments in sought-after harbourside and inner-city locations. Their portfolio includes over $2 billion in completed residential projects. They are known for creating communities, not just buildings, with a focus on resident amenity and long-term value.",
  },
  {
    name: "Metro Commercial Developments",
    type: "developer",
    suburb: "Melbourne", state: "VIC", country: "AU",
    sectors: ["Development", "Commercial"],
    trades: ["Property Development"],
    primaryColor: "#262626",
    description: "Metro Commercial Developments specialises in large-scale commercial office towers and mixed-use precincts across Melbourne's CBD and inner suburbs. Their developments feature cutting-edge sustainability credentials and premium tenant amenities. They have a pipeline of over $3 billion in active projects.",
  },
  {
    name: "Queensland Health Infrastructure",
    type: "govclient",
    suburb: "Brisbane", state: "QLD", country: "AU",
    sectors: ["Government", "Health"],
    trades: ["Government Infrastructure"],
    primaryColor: "#2f2f2f",
    description: "Queensland Health Infrastructure is the state government entity responsible for planning, delivering, and maintaining Queensland's public health facilities. They manage a portfolio of hospital expansions, regional health centres, and specialist medical facilities. Their projects serve communities across metropolitan and regional Queensland.",
  },
  {
    name: "Te Ara Development Trust",
    type: "developer",
    suburb: "Auckland", state: "", country: "NZ",
    sectors: ["Development", "Community"],
    trades: ["Community Development"],
    primaryColor: "#3a3a3a",
    description: "Te Ara Development Trust is an Auckland-based community development organisation focused on affordable housing and community infrastructure across New Zealand. They partner with iwi, local government, and private sector to deliver culturally responsive developments. Their projects prioritise sustainability, accessibility, and community wellbeing.",
  },
];

// ─── Project Templates per Company Type ──────────────────

interface ProjectTemplate {
  titleTemplate: string;
  scopeTemplate: string;
  caseStudyTemplate: string | null;
  sectorTags: string[];
  features: string[];
}

const TIER1_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Commercial Tower", scopeTemplate: "Design and construction of a 45-storey commercial office tower featuring Grade A office space and ground-level retail. The project included complex foundation works and advanced facade engineering.", caseStudyTemplate: "This landmark commercial tower project involved coordinating over 200 subcontractors across a 36-month construction programme. The building achieved a 5 Star Green Star rating through innovative energy recovery systems, high-performance glazing, and intelligent building management systems. Key challenges included constructing the tower's distinctive curved facade and managing extensive services coordination within tight floor-to-ceiling heights.", sectorTags: ["Commercial"], features: ["Grade A Office", "Retail Podium", "End-of-trip Facilities"] },
  { titleTemplate: "{location} Hospital Expansion", scopeTemplate: "Major hospital expansion delivering new emergency department, surgical suites, and inpatient wards. The project was completed while the existing hospital remained fully operational.", caseStudyTemplate: "Delivering a major hospital expansion in a live healthcare environment required meticulous planning to maintain infection control, emergency access, and patient safety throughout construction. The project team implemented a phased construction strategy that allowed the existing emergency department to operate without interruption. Advanced prefabrication techniques were used for the mechanical plant to minimise on-site work duration.", sectorTags: ["Health", "Government"], features: ["Emergency Department", "Operating Theatres", "Helipad"] },
  { titleTemplate: "{location} Metro Rail Station", scopeTemplate: "Construction of a new underground metro rail station including platform excavation, concourse structure, and surface-level station building. The station serves as a critical interchange in the city's expanding rail network.", caseStudyTemplate: null, sectorTags: ["Infrastructure", "Transport"], features: ["Underground Platforms", "Bus Interchange", "Retail Concourse"] },
  { titleTemplate: "{location} Waterfront Precinct", scopeTemplate: "Mixed-use waterfront development comprising residential apartments, commercial offices, and public open space. The project involved significant marine and geotechnical works along the harbour edge.", caseStudyTemplate: null, sectorTags: ["Mixed-Use", "Residential"], features: ["Residential Towers", "Marina", "Public Promenade"] },
  { titleTemplate: "{location} Convention Centre", scopeTemplate: "Construction of a new convention and exhibition centre with a 5,000-seat plenary hall, multiple exhibition halls, and supporting conference facilities. The project features an architecturally significant roof structure spanning over 120 metres.", caseStudyTemplate: "The convention centre project presented unique structural engineering challenges with its signature long-span roof structure. The construction team employed a combination of steel truss systems and post-tensioned concrete to achieve the column-free exhibition spaces required by the brief. Acoustic engineering was critical throughout, with the plenary hall achieving NC-25 background noise levels despite being adjacent to active exhibition spaces.", sectorTags: ["Commercial", "Community"], features: ["Plenary Hall", "Exhibition Halls", "Meeting Rooms"] },
  { titleTemplate: "{location} Data Centre Campus", scopeTemplate: "Purpose-built hyperscale data centre campus with N+1 redundancy across power and cooling systems. The facility was designed to support up to 50MW of IT load across multiple halls.", caseStudyTemplate: null, sectorTags: ["Industrial", "Technology"], features: ["Server Halls", "UPS Systems", "Cooling Plant"] },
  { titleTemplate: "{location} Airport Terminal Upgrade", scopeTemplate: "Upgrade and expansion of the international terminal including new departures lounge, aerobridges, and baggage handling systems. Construction was completed in stages to maintain airport operations throughout.", caseStudyTemplate: null, sectorTags: ["Infrastructure", "Aviation"], features: ["Departures Lounge", "Aerobridges", "Duty Free"] },
];

const MIDTIER_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Residential Complex", scopeTemplate: "Construction of a medium-density residential complex comprising 85 apartments across two buildings with basement car parking and landscaped podium. The development includes a mix of one, two, and three-bedroom apartments.", caseStudyTemplate: null, sectorTags: ["Residential"], features: ["Apartments", "Basement Parking", "Rooftop Garden"] },
  { titleTemplate: "{location} School Upgrade", scopeTemplate: "Comprehensive upgrade of an existing secondary school including new STEM building, performing arts centre, and sports courts. The project was delivered across multiple stages during school term breaks.", caseStudyTemplate: "Delivering a school upgrade project requires careful coordination around the academic calendar and maintaining student safety. The construction team worked closely with the school administration to schedule demolition and high-noise activities during holiday periods. The new STEM building features flexible learning spaces, maker workshops, and a robotics lab designed to inspire the next generation of students.", sectorTags: ["Education"], features: ["STEM Building", "Performing Arts Centre", "Sports Courts"] },
  { titleTemplate: "{location} Office Fitout", scopeTemplate: "Premium commercial office fitout spanning three floors of an existing commercial tower. The design features open-plan workspaces, collaboration zones, and a client-facing reception area.", caseStudyTemplate: null, sectorTags: ["Commercial", "Fitout"], features: ["Open-Plan Office", "Meeting Rooms", "End-of-trip"] },
  { titleTemplate: "{location} Retail Centre Refurbishment", scopeTemplate: "Major refurbishment of an existing neighbourhood shopping centre including new food court, specialty tenancies, and car park expansion. Works were staged to allow trading to continue.", caseStudyTemplate: null, sectorTags: ["Commercial", "Retail"], features: ["Food Court", "Specialty Retail", "Car Park"] },
  { titleTemplate: "{location} Aged Care Facility", scopeTemplate: "New aged care facility providing 120 beds across residential care and independent living units. The design prioritises natural light, garden access, and homelike environments for residents.", caseStudyTemplate: null, sectorTags: ["Health", "Residential"], features: ["Residential Care", "Independent Living", "Community Hub"] },
  { titleTemplate: "{location} Community Recreation Centre", scopeTemplate: "New community recreation centre featuring indoor pool, gymnasium, group fitness studios, and community meeting rooms. The facility was designed as a focal point for the growing residential precinct.", caseStudyTemplate: null, sectorTags: ["Community", "Recreation"], features: ["Indoor Pool", "Gymnasium", "Community Rooms"] },
];

const SUBCONTRACTOR_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Tiling Package — {parent}", scopeTemplate: "Supply and installation of floor and wall tiling across all common areas, lobbies, and wet areas for a multi-storey residential development. The package included waterproofing to all bathrooms and balconies.", caseStudyTemplate: null, sectorTags: ["Residential", "Subcontracting"], features: ["Floor Tiling", "Wall Tiling", "Waterproofing"] },
  { titleTemplate: "{location} Electrical Installation — {parent}", scopeTemplate: "Complete electrical installation including power distribution, lighting, data cabling, and fire detection systems for a commercial office building. The scope included high-voltage switchgear and generator backup.", caseStudyTemplate: null, sectorTags: ["Commercial", "Subcontracting"], features: ["Power Distribution", "Lighting", "Fire Detection"] },
  { titleTemplate: "{location} Roofing Works — {parent}", scopeTemplate: "Supply and installation of metal roof cladding and associated flashings for a large industrial warehouse complex. The scope included insulation, guttering, and downpipe systems.", caseStudyTemplate: null, sectorTags: ["Industrial", "Subcontracting"], features: ["Metal Roofing", "Insulation", "Guttering"] },
  { titleTemplate: "{location} Plastering Package — {parent}", scopeTemplate: "Internal plasterboard lining and external render to a mid-rise residential development. Works included acoustic separation systems, fire-rated walls, and decorative cornicing.", caseStudyTemplate: null, sectorTags: ["Residential", "Subcontracting"], features: ["Plasterboard", "Rendering", "Acoustic Systems"] },
  { titleTemplate: "{location} Plumbing & Hydraulics — {parent}", scopeTemplate: "Complete plumbing and hydraulic services installation for a mixed-use development including potable water, sanitary drainage, stormwater, and gas reticulation. The scope included rooftop solar hot water systems.", caseStudyTemplate: null, sectorTags: ["Mixed-Use", "Subcontracting"], features: ["Plumbing", "Drainage", "Solar Hot Water"] },
  { titleTemplate: "{location} Steel Fabrication — {parent}", scopeTemplate: "Fabrication and erection of structural steelwork for a commercial warehouse including portal frames, mezzanine floors, and canopy structures. All steelwork was fabricated in-house and delivered to site.", caseStudyTemplate: null, sectorTags: ["Industrial", "Subcontracting"], features: ["Portal Frames", "Mezzanine", "Canopy"] },
  { titleTemplate: "{location} Fire Protection — {parent}", scopeTemplate: "Design and installation of fire sprinkler and hydrant systems for a high-rise residential tower. The scope included fire pump sets, risers, and apartment sprinkler reticulation.", caseStudyTemplate: null, sectorTags: ["Residential", "Subcontracting"], features: ["Sprinklers", "Hydrants", "Fire Pumps"] },
];

const CONSULTANT_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Architectural Design — {parent}", scopeTemplate: "Full architectural services from concept design through to construction documentation and contract administration for a landmark commercial development. The design achieved national architecture awards.", caseStudyTemplate: null, sectorTags: ["Architecture", "Commercial"], features: ["Concept Design", "Documentation", "Contract Admin"] },
  { titleTemplate: "{location} Structural Engineering — {parent}", scopeTemplate: "Structural engineering design for a 30-storey residential tower including foundation design, floor systems, and lateral stability analysis. The design optimised material usage through advanced computational modelling.", caseStudyTemplate: null, sectorTags: ["Engineering", "Residential"], features: ["Foundation Design", "Floor Systems", "Seismic Analysis"] },
  { titleTemplate: "{location} ESD Consulting — {parent}", scopeTemplate: "Environmental sustainability design consulting for a Green Star-targeted commercial development. Services included energy modelling, daylight analysis, and materials lifecycle assessment.", caseStudyTemplate: null, sectorTags: ["Sustainability"], features: ["Energy Modelling", "Green Star", "Materials Assessment"] },
  { titleTemplate: "{location} Project Management — {parent}", scopeTemplate: "Independent project management and superintendent services for a major hospital redevelopment. The role included programme management, cost control, and stakeholder engagement.", caseStudyTemplate: null, sectorTags: ["Project Management", "Health"], features: ["Programme Management", "Cost Control", "Stakeholder Management"] },
  { titleTemplate: "{location} Interior Design — {parent}", scopeTemplate: "Interior design services for a premium hotel including guest rooms, public areas, restaurants, and conference facilities. The design drew on local cultural references and sustainable materials.", caseStudyTemplate: null, sectorTags: ["Hospitality", "Interior Design"], features: ["Guest Rooms", "Restaurant", "Conference Facilities"] },
  { titleTemplate: "{location} Heritage Assessment — {parent}", scopeTemplate: "Heritage impact assessment and conservation management plan for a heritage-listed warehouse conversion. The project balanced heritage conservation requirements with contemporary commercial use.", caseStudyTemplate: null, sectorTags: ["Heritage", "Commercial"], features: ["Heritage Assessment", "Conservation Plan", "Adaptive Reuse"] },
];

const DEVELOPER_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Residential Development", scopeTemplate: "Master-planned residential community comprising 350 dwellings across townhouses, apartments, and detached homes. The development features extensive parklands, community facilities, and sustainable infrastructure.", caseStudyTemplate: "This master-planned residential development transformed a former industrial site into a vibrant new community. The development team worked closely with local council and community groups to ensure the project responded to local needs and character. Key sustainability features include precinct-wide recycled water systems, extensive solar panel installations, and a community garden that serves as a social hub for residents.", sectorTags: ["Development", "Residential"], features: ["Townhouses", "Apartments", "Parklands"] },
  { titleTemplate: "{location} Commercial Tower Development", scopeTemplate: "Premium commercial office tower development in the CBD featuring 40,000 sqm of A-grade office space, ground-level retail, and end-of-trip facilities. The building targets a 6 Star Green Star rating.", caseStudyTemplate: null, sectorTags: ["Development", "Commercial"], features: ["A-Grade Office", "Retail Podium", "Green Star 6"] },
  { titleTemplate: "{location} Mixed-Use Precinct", scopeTemplate: "Large-scale mixed-use precinct development including residential apartments, retail, commercial office space, and a public plaza. The development creates a new urban village centre for the growing suburb.", caseStudyTemplate: null, sectorTags: ["Development", "Mixed-Use"], features: ["Apartments", "Retail", "Public Plaza"] },
  { titleTemplate: "{location} Build-to-Rent Complex", scopeTemplate: "Purpose-built rental housing development comprising 200 apartments with premium resident amenities including co-working spaces, rooftop terrace, and concierge services. The project addresses growing demand for quality rental housing.", caseStudyTemplate: null, sectorTags: ["Development", "Residential"], features: ["Rental Apartments", "Co-working", "Rooftop Amenity"] },
  { titleTemplate: "{location} Community Housing Project", scopeTemplate: "Community housing development delivering 80 social and affordable housing dwellings in partnership with state government. The project sets a new benchmark for quality and amenity in social housing.", caseStudyTemplate: null, sectorTags: ["Development", "Community"], features: ["Social Housing", "Affordable Housing", "Community Spaces"] },
  { titleTemplate: "{location} Industrial Estate", scopeTemplate: "Development of a 25-hectare industrial estate comprising warehousing, logistics facilities, and ancillary office buildings. The estate is strategically located near major transport corridors and port facilities.", caseStudyTemplate: null, sectorTags: ["Development", "Industrial"], features: ["Warehousing", "Logistics", "Office Space"] },
];

const GOVCLIENT_PROJECTS: ProjectTemplate[] = [
  { titleTemplate: "{location} Regional Hospital", scopeTemplate: "New 250-bed regional hospital providing emergency, surgical, maternity, and mental health services to the growing regional community. The facility incorporates advanced clinical technology and patient-centred design.", caseStudyTemplate: "The regional hospital project represents a major investment in healthcare infrastructure for the community. The design team developed a masterplan that allows for future expansion while delivering immediate clinical capacity. The building's modular design enables flexible ward configurations that can adapt to changing healthcare models and community demographics.", sectorTags: ["Government", "Health"], features: ["Emergency Department", "Surgical Suites", "Mental Health Unit"] },
  { titleTemplate: "{location} Health Centre Upgrade", scopeTemplate: "Upgrade and expansion of an existing community health centre to include new GP clinics, allied health suites, and diagnostic imaging facilities. The project was designed to improve access to primary healthcare services.", caseStudyTemplate: null, sectorTags: ["Government", "Health"], features: ["GP Clinics", "Allied Health", "Diagnostic Imaging"] },
  { titleTemplate: "{location} Mental Health Facility", scopeTemplate: "New purpose-built mental health facility providing acute inpatient beds, day programme spaces, and community mental health services. The design prioritises therapeutic environments and patient dignity.", caseStudyTemplate: null, sectorTags: ["Government", "Health", "Mental Health"], features: ["Inpatient Beds", "Day Programme", "Community Services"] },
  { titleTemplate: "{location} Rehabilitation Centre", scopeTemplate: "Construction of a specialist rehabilitation centre providing physiotherapy, occupational therapy, and hydrotherapy services. The facility features accessible design throughout and a therapeutic garden.", caseStudyTemplate: null, sectorTags: ["Government", "Health"], features: ["Physiotherapy", "Hydrotherapy Pool", "Therapeutic Garden"] },
  { titleTemplate: "{location} Surgical Centre", scopeTemplate: "New ambulatory surgical centre with six operating theatres and associated pre-operative and recovery areas. The facility handles day surgery cases, freeing up capacity in the main hospital.", caseStudyTemplate: null, sectorTags: ["Government", "Health"], features: ["Operating Theatres", "Day Surgery", "Recovery Suites"] },
  { titleTemplate: "{location} Pathology Laboratory", scopeTemplate: "Purpose-built pathology laboratory and specimen collection centre serving the regional health network. The facility meets PC2 laboratory containment standards and includes automated specimen processing systems.", caseStudyTemplate: null, sectorTags: ["Government", "Health", "Science"], features: ["Laboratory", "Specimen Collection", "Automated Processing"] },
];

// ─── Skills by Role Category ─────────────────────────────

const SKILLS_BY_ROLE: Record<string, string[]> = {
  CONSTRUCTION_MANAGER: ["Project Planning", "Risk Management", "Contract Administration", "Stakeholder Management", "Cost Control", "Programme Management", "Safety Management", "Quality Assurance", "Team Leadership", "Procurement"],
  ARCHITECT: ["AutoCAD", "Revit", "SketchUp", "Design Documentation", "Town Planning", "Sustainable Design", "Heritage Conservation", "Interior Design", "BIM Management", "Client Briefing"],
  BUILDER: ["Site Management", "Quality Control", "Safety Systems", "Subcontractor Management", "Programming", "Cost Reporting", "Defect Management", "Handover Procedures", "Contract Administration", "Building Codes"],
  ENGINEER: ["Structural Analysis", "SAP2000", "ETABS", "Foundation Design", "Seismic Design", "Steel Design", "Concrete Design", "Finite Element Analysis", "Geotechnical Assessment", "Report Writing"],
  SUBCONTRACTOR: ["Trade Supervision", "Material Estimation", "Quality Workmanship", "Safety Compliance", "Tool Proficiency", "Blueprint Reading", "Time Management", "Team Coordination", "Problem Solving", "Client Communication"],
};

const ROLE_TITLES: Record<string, string[]> = {
  CONSTRUCTION_MANAGER: ["Construction Manager", "Project Director", "Site Manager", "Senior Project Manager", "Regional Construction Manager"],
  ARCHITECT: ["Senior Architect", "Design Director", "Project Architect", "Associate Architect", "Design Manager"],
  BUILDER: ["Site Foreman", "Senior Site Manager", "Project Manager", "Building Supervisor", "Contracts Manager"],
  ENGINEER: ["Senior Structural Engineer", "Principal Engineer", "Design Engineer", "Project Engineer", "Engineering Manager"],
  SUBCONTRACTOR: ["Trades Supervisor", "Lead Hand", "Site Foreman", "Operations Manager", "Contracts Administrator"],
};

// ─── Main Seed Function ──────────────────────────────────

async function main() {
  console.log("Starting seed...");
  console.log("Cleaning existing data...");

  // Delete in reverse dependency order
  await prisma.personalProjectExperience.deleteMany();
  await prisma.roleExperience.deleteMany();
  await prisma.personalProfile.deleteMany();
  await prisma.capabilityProfileItem.deleteMany();
  await prisma.capabilityProfile.deleteMany();
  await prisma.projectCaseStudy.deleteMany();
  await prisma.projectCredit.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.projectStakeholder.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.article.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("All existing data cleaned.");

  // Hash password once and reuse
  const passwordHash = await bcrypt.hash("password123", 12);
  console.log("Password hash generated.");

  // ── Create Companies ─────────────────────────────────

  console.log("Creating 20 companies...");
  const companyRecords: Record<string, { id: string; slug: string; name: string; type: string; suburb: string; state: string; country: string }> = {};

  for (const def of COMPANIES) {
    const slug = slugify(def.name);
    const company = await prisma.company.create({
      data: {
        name: def.name,
        slug,
        description: def.description,
        suburb: def.suburb,
        state: def.state,
        country: def.country,
        primaryColor: def.primaryColor,
        sectors: def.sectors,
        trades: def.trades,
        isUnclaimed: true,
        isFeatured: ["tier1", "developer"].includes(def.type),
        viewCount: randomInt(200, 8000),
        planTier: "FREE",
      },
    });
    companyRecords[slug] = { id: company.id, slug, name: def.name, type: def.type, suburb: def.suburb, state: def.state, country: def.country };
  }
  console.log("20 companies created.");

  // Build lookup arrays by type
  const builderCompanies = Object.values(companyRecords).filter(c => ["tier1", "midtier"].includes(c.type));
  const consultantCompanies = Object.values(companyRecords).filter(c => c.type === "consultant");
  const developerCompanies = Object.values(companyRecords).filter(c => ["developer", "govclient"].includes(c.type));
  const subcontractorCompanies = Object.values(companyRecords).filter(c => c.type === "subcontractor");

  // ── Create Projects ──────────────────────────────────

  console.log("Creating projects...");
  const allProjects: Array<{ id: string; title: string; companyId: string; companySlug: string; companyName: string; suburb: string; state: string; country: string; companyType: string }> = [];
  let featuredCount = 0;
  let spotlightAssigned = false;
  let globalProjectIndex = 0;

  for (const def of COMPANIES) {
    const companySlug = slugify(def.name);
    const companyInfo = companyRecords[companySlug];
    let templates: ProjectTemplate[];
    let budgetBands: Array<"UNDER_1M" | "FROM_1M_TO_10M" | "FROM_10M_TO_50M" | "OVER_50M">;
    let projectCount: number;

    switch (def.type) {
      case "tier1":
        templates = TIER1_PROJECTS;
        budgetBands = ["FROM_10M_TO_50M", "OVER_50M"];
        projectCount = 7;
        break;
      case "midtier":
        templates = MIDTIER_PROJECTS;
        budgetBands = ["FROM_1M_TO_10M", "FROM_10M_TO_50M"];
        projectCount = 6;
        break;
      case "subcontractor":
        templates = SUBCONTRACTOR_PROJECTS;
        budgetBands = ["UNDER_1M", "FROM_1M_TO_10M"];
        projectCount = 5;
        break;
      case "consultant":
        templates = CONSULTANT_PROJECTS;
        budgetBands = ["FROM_1M_TO_10M", "FROM_10M_TO_50M"];
        projectCount = 6;
        break;
      case "developer":
        templates = DEVELOPER_PROJECTS;
        budgetBands = ["FROM_10M_TO_50M", "OVER_50M"];
        projectCount = 6;
        break;
      case "govclient":
        templates = GOVCLIENT_PROJECTS;
        budgetBands = ["FROM_10M_TO_50M", "OVER_50M"];
        projectCount = 6;
        break;
      default:
        templates = MIDTIER_PROJECTS;
        budgetBands = ["FROM_1M_TO_10M"];
        projectCount = 5;
    }

    for (let i = 0; i < projectCount; i++) {
      const template = templates[i % templates.length];
      const loc = randomProjectLocation();
      const parentBuilder = pick(builderCompanies);
      const title = template.titleTemplate
        .replace("{location}", loc.suburb)
        .replace("{parent}", parentBuilder.name);
      const slug = slugify(title) + "-" + (globalProjectIndex + 1);
      const completionYear = randomInt(2018, 2025);
      const isFeatured = featuredCount < 8 && Math.random() < 0.07;
      const isSpotlight = !spotlightAssigned && globalProjectIndex === 15;

      if (isFeatured) featuredCount++;
      if (isSpotlight) spotlightAssigned = true;

      const project = await prisma.project.create({
        data: {
          companyId: companyInfo.id,
          title,
          slug,
          client: pick(developerCompanies).name,
          suburb: loc.suburb,
          state: loc.state,
          country: loc.country,
          sectorTags: template.sectorTags,
          completionYear,
          budgetBand: pick(budgetBands),
          scopeSummary: template.scopeTemplate,
          caseStudy: template.caseStudyTemplate,
          heroImageUrl: nextHeroImage(),
          publishStatus: "PUBLIC",
          isConfidential: false,
          description: template.scopeTemplate,
          features: template.features,
          isFeatured,
          isSpotlight,
          viewCount: randomInt(50, 5000),
        },
      });

      allProjects.push({
        id: project.id,
        title,
        companyId: companyInfo.id,
        companySlug,
        companyName: def.name,
        suburb: loc.suburb,
        state: loc.state,
        country: loc.country,
        companyType: def.type,
      });
      globalProjectIndex++;
    }
  }
  console.log(`${allProjects.length} projects created.`);

  // ── Create Stakeholders per Project ──────────────────

  console.log("Creating stakeholders...");
  let stakeholderCount = 0;

  for (const proj of allProjects) {
    const stakeholderData: Array<{
      projectId: string;
      role: "CLIENT" | "ARCHITECT" | "BUILDER" | "ENGINEER" | "CONSTRUCTION_MANAGER";
      name: string;
      companyName: string;
    }> = [];

    // CLIENT
    const clientCompany = pick(developerCompanies);
    stakeholderData.push({
      projectId: proj.id,
      role: "CLIENT",
      name: clientCompany.name,
      companyName: clientCompany.name,
    });

    // ARCHITECT
    const architectCompany = pick(consultantCompanies.filter(c => c.slug === "darling-architects") || consultantCompanies);
    stakeholderData.push({
      projectId: proj.id,
      role: "ARCHITECT",
      name: architectCompany.name,
      companyName: architectCompany.name,
    });

    // BUILDER
    const builderCompany = proj.companyType === "tier1" || proj.companyType === "midtier"
      ? companyRecords[proj.companySlug]
      : pick(builderCompanies);
    stakeholderData.push({
      projectId: proj.id,
      role: "BUILDER",
      name: builderCompany.name,
      companyName: builderCompany.name,
    });

    // ENGINEER
    const engineerCompany = consultantCompanies.find(c => c.slug === "structural-dynamics-engineering") || pick(consultantCompanies);
    stakeholderData.push({
      projectId: proj.id,
      role: "ENGINEER",
      name: engineerCompany.name,
      companyName: engineerCompany.name,
    });

    // CONSTRUCTION_MANAGER (sometimes)
    if (Math.random() < 0.5) {
      const pmCompany = consultantCompanies.find(c => c.slug === "pacific-project-management") || pick(consultantCompanies);
      stakeholderData.push({
        projectId: proj.id,
        role: "CONSTRUCTION_MANAGER",
        name: pmCompany.name,
        companyName: pmCompany.name,
      });
    }

    await prisma.projectStakeholder.createMany({ data: stakeholderData });
    stakeholderCount += stakeholderData.length;
  }
  console.log(`${stakeholderCount} stakeholders created.`);

  // ── Create Media per Project ─────────────────────────

  console.log("Creating project media...");
  const allMediaData: Array<{
    projectId: string;
    mediaType: "IMAGE";
    url: string;
    caption: string;
  }> = [];

  for (const proj of allProjects) {
    const mediaCount = randomInt(2, 3);
    for (let m = 0; m < mediaCount; m++) {
      allMediaData.push({
        projectId: proj.id,
        mediaType: "IMAGE",
        url: nextMediaImage(),
        caption: pick(MEDIA_CAPTIONS),
      });
    }
  }
  await prisma.projectMedia.createMany({ data: allMediaData });
  console.log(`${allMediaData.length} media items created.`);

  // ── Create Credits & Personal Profiles per Project ───

  console.log("Creating credits and personal profiles...");
  let creditCount = 0;
  let personCount = 0;
  let nameCounter = 0;

  function generatePersonName(): { firstName: string; lastName: string; fullName: string } {
    const firstName = FIRST_NAMES[nameCounter % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(nameCounter / FIRST_NAMES.length) % LAST_NAMES.length];
    nameCounter++;
    return { firstName, lastName, fullName: `${firstName} ${lastName}` };
  }

  // Track created personal profiles to avoid duplicates per person
  const createdProfiles: Map<string, { userId: string; profileId: string; fullName: string; slug: string }> = new Map();

  for (const proj of allProjects) {
    const creditDataForProject: Array<{
      roleCategory: "CONSTRUCTION_MANAGER" | "ARCHITECT" | "BUILDER" | "ENGINEER" | "SUBCONTRACTOR";
      entityType: "PERSON" | "BUSINESS";
      entityName: string;
      tradeGroup: string | null;
      linkedCompanySlug: string | null;
      sortOrder: number;
    }> = [];

    // 1 CONSTRUCTION_MANAGER (PERSON)
    creditDataForProject.push({
      roleCategory: "CONSTRUCTION_MANAGER",
      entityType: "PERSON",
      entityName: "", // Will be filled with generated name
      tradeGroup: null,
      linkedCompanySlug: null,
      sortOrder: 1,
    });

    // 1-2 ARCHITECT (mix PERSON and BUSINESS)
    const archCount = randomInt(1, 2);
    for (let a = 0; a < archCount; a++) {
      if (a === 0) {
        creditDataForProject.push({
          roleCategory: "ARCHITECT",
          entityType: "PERSON",
          entityName: "",
          tradeGroup: null,
          linkedCompanySlug: null,
          sortOrder: 10 + a,
        });
      } else {
        creditDataForProject.push({
          roleCategory: "ARCHITECT",
          entityType: "BUSINESS",
          entityName: companyRecords["darling-architects"]?.name || "Darling Architects",
          tradeGroup: null,
          linkedCompanySlug: "darling-architects",
          sortOrder: 10 + a,
        });
      }
    }

    // 1-2 BUILDER (mix PERSON and BUSINESS)
    const builderCount = randomInt(1, 2);
    for (let b = 0; b < builderCount; b++) {
      if (b === 0) {
        creditDataForProject.push({
          roleCategory: "BUILDER",
          entityType: "PERSON",
          entityName: "",
          tradeGroup: null,
          linkedCompanySlug: null,
          sortOrder: 20 + b,
        });
      } else {
        const builderComp = pick(builderCompanies);
        creditDataForProject.push({
          roleCategory: "BUILDER",
          entityType: "BUSINESS",
          entityName: builderComp.name,
          tradeGroup: null,
          linkedCompanySlug: builderComp.slug,
          sortOrder: 20 + b,
        });
      }
    }

    // 1-2 ENGINEER (mix PERSON and BUSINESS)
    const engCount = randomInt(1, 2);
    for (let e = 0; e < engCount; e++) {
      if (e === 0) {
        creditDataForProject.push({
          roleCategory: "ENGINEER",
          entityType: "PERSON",
          entityName: "",
          tradeGroup: null,
          linkedCompanySlug: null,
          sortOrder: 30 + e,
        });
      } else {
        creditDataForProject.push({
          roleCategory: "ENGINEER",
          entityType: "BUSINESS",
          entityName: companyRecords["structural-dynamics-engineering"]?.name || "Structural Dynamics Engineering",
          tradeGroup: null,
          linkedCompanySlug: "structural-dynamics-engineering",
          sortOrder: 30 + e,
        });
      }
    }

    // 12-15 SUBCONTRACTOR credits
    const subCount = randomInt(12, 15);
    const selectedTrades = pickN(SUBCONTRACTOR_TRADES, subCount);
    for (let s = 0; s < subCount; s++) {
      const trade = selectedTrades[s];
      const linkedSlug = TRADE_TO_COMPANY_SLUG[trade] || null;
      const isBusinessCredit = linkedSlug && Math.random() < 0.6;

      if (isBusinessCredit) {
        creditDataForProject.push({
          roleCategory: "SUBCONTRACTOR",
          entityType: "BUSINESS",
          entityName: companyRecords[linkedSlug]?.name || trade + " Services",
          tradeGroup: trade,
          linkedCompanySlug: linkedSlug,
          sortOrder: 40 + s,
        });
      } else {
        creditDataForProject.push({
          roleCategory: "SUBCONTRACTOR",
          entityType: "PERSON",
          entityName: "",
          tradeGroup: trade,
          linkedCompanySlug: null,
          sortOrder: 40 + s,
        });
      }
    }

    // Now create each credit, generating person profiles for PERSON types
    for (const creditDef of creditDataForProject) {
      if (creditDef.entityType === "PERSON") {
        const { firstName, lastName, fullName } = generatePersonName();
        creditDef.entityName = fullName;

        const emailSuffix = nameCounter;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace("'", "")}.${emailSuffix}@seed.workdon.dev`;
        const profileSlug = slugify(fullName) + "-" + emailSuffix;

        // Determine role-appropriate details
        const roleCat = creditDef.roleCategory;
        const roleTitle = pick(ROLE_TITLES[roleCat] || ROLE_TITLES.BUILDER);
        const skills = pickN(SKILLS_BY_ROLE[roleCat] || SKILLS_BY_ROLE.BUILDER, randomInt(4, 7));
        const yearsExp = randomInt(3, 30);
        const headline = `${roleTitle} | ${proj.companyName}`;
        const bio = `${fullName} is a ${roleTitle.toLowerCase()} with ${yearsExp} years of experience in the Australian construction industry. Specialising in ${creditDef.tradeGroup || roleCat.toLowerCase().replace("_", " ")}, ${firstName} has contributed to numerous projects across ${proj.suburb} and surrounding regions.`;

        // Determine a linked company
        let linkedCompanyId: string | null = null;
        let companyNameForRole = proj.companyName;

        if (roleCat === "ARCHITECT") {
          linkedCompanyId = companyRecords["darling-architects"]?.id || null;
          companyNameForRole = "Darling Architects";
        } else if (roleCat === "ENGINEER") {
          linkedCompanyId = companyRecords["structural-dynamics-engineering"]?.id || null;
          companyNameForRole = "Structural Dynamics Engineering";
        } else if (roleCat === "CONSTRUCTION_MANAGER") {
          linkedCompanyId = companyRecords["pacific-project-management"]?.id || null;
          companyNameForRole = "Pacific Project Management";
        } else if (roleCat === "SUBCONTRACTOR" && creditDef.tradeGroup) {
          const tradeSlug = TRADE_TO_COMPANY_SLUG[creditDef.tradeGroup];
          if (tradeSlug && companyRecords[tradeSlug]) {
            linkedCompanyId = companyRecords[tradeSlug].id;
            companyNameForRole = companyRecords[tradeSlug].name;
          }
        } else {
          // BUILDER — link to owning company
          linkedCompanyId = companyRecords[proj.companySlug]?.id || null;
        }

        // Create User
        const user = await prisma.user.create({
          data: {
            email,
            passwordHash: passwordHash,
            name: fullName,
            accountType: "PERSONAL",
          },
        });

        // Create PersonalProfile
        const profile = await prisma.personalProfile.create({
          data: {
            userId: user.id,
            fullName,
            slug: profileSlug,
            headline,
            bio,
            roleTitle,
            location: proj.country === "AU" && proj.state ? `${proj.suburb}, ${proj.state}` : `${proj.suburb}, ${proj.country}`,
            yearsExperience: yearsExp,
            skills,
          },
        });

        // Create RoleExperience
        await prisma.roleExperience.create({
          data: {
            personalProfileId: profile.id,
            companyName: companyNameForRole,
            linkedCompanyId,
            roleTitle,
            startYear: 2025 - yearsExp,
            isCurrent: true,
          },
        });

        // Create PersonalProjectExperience
        await prisma.personalProjectExperience.create({
          data: {
            personalProfileId: profile.id,
            projectId: proj.id,
            projectName: proj.title,
            roleTitle,
            contribution: `Served as ${roleTitle.toLowerCase()} on the ${proj.title} project, responsible for ${creditDef.tradeGroup || roleCat.toLowerCase().replace("_", " ")} scope.`,
          },
        });

        // Create ProjectCredit linked to profile
        await prisma.projectCredit.create({
          data: {
            projectId: proj.id,
            roleCategory: creditDef.roleCategory,
            tradeGroup: creditDef.tradeGroup,
            entityType: "PERSON",
            entityName: fullName,
            linkedCompanySlug: creditDef.linkedCompanySlug,
            linkedPersonalProfileId: profile.id,
            sortOrder: creditDef.sortOrder,
          },
        });

        personCount++;
      } else {
        // BUSINESS credit — no personal profile needed
        await prisma.projectCredit.create({
          data: {
            projectId: proj.id,
            roleCategory: creditDef.roleCategory,
            tradeGroup: creditDef.tradeGroup,
            entityType: "BUSINESS",
            entityName: creditDef.entityName,
            linkedCompanySlug: creditDef.linkedCompanySlug,
            sortOrder: creditDef.sortOrder,
          },
        });
      }
      creditCount++;
    }

    // Log progress every 20 projects
    if ((allProjects.indexOf(proj) + 1) % 20 === 0) {
      console.log(`  ...processed ${allProjects.indexOf(proj) + 1}/${allProjects.length} projects`);
    }
  }
  console.log(`${creditCount} credits created.`);
  console.log(`${personCount} personal profiles created.`);

  // ── Create Articles ──────────────────────────────────

  console.log("Creating articles...");

  const articles = [
    {
      title: "The Rise of Mass Timber Construction in Australia",
      slug: "rise-of-mass-timber-construction-australia",
      excerpt: "Mass timber is emerging as a viable alternative to steel and concrete for mid-rise buildings across Australia, driven by sustainability goals and engineering innovation.",
      body: "The Australian construction industry is witnessing a significant shift towards mass timber construction, with cross-laminated timber (CLT) and glue-laminated timber (glulam) structures becoming increasingly common in commercial and residential developments. This trend is driven by a convergence of sustainability imperatives, engineering advances, and favourable lifecycle cost analyses.\n\nMass timber buildings offer substantially lower embodied carbon compared to traditional steel and concrete structures. A typical CLT building stores approximately 1 tonne of CO2 per cubic metre of timber used, while simultaneously avoiding the significant emissions associated with cement and steel production. For a country committed to net-zero emissions by 2050, this makes mass timber an attractive proposition.\n\nRecent projects like the 10-storey Forte building in Melbourne's Docklands and the Atlassian headquarters in Sydney demonstrate that timber can perform at scale. These projects have proven that mass timber can meet fire safety requirements through charring calculations and protective systems, while delivering construction speed advantages of 20-30% compared to conventional methods.\n\nHowever, challenges remain. Supply chain constraints, insurance uncertainties, and a skills gap in timber engineering design are all areas requiring industry attention. The establishment of timber engineering courses at several Australian universities and the development of local CLT manufacturing facilities are positive steps towards addressing these barriers.",
      authorName: "Dr. Sarah Mitchell",
      tags: ["sustainability", "innovation", "timber", "trends"],
      heroImageUrl: HERO_IMAGES[0],
    },
    {
      title: "Understanding Green Star Ratings for Construction Projects",
      slug: "understanding-green-star-ratings-construction",
      excerpt: "A practical guide to Green Star certification for Australian construction projects, covering rating tools, credit categories, and the business case for sustainable building.",
      body: "Green Star is Australia's internationally recognised rating system for sustainable buildings, fitouts, and communities. Administered by the Green Building Council of Australia (GBCA), it provides a comprehensive framework for evaluating the environmental design and construction of buildings and communities.\n\nThe Green Star rating system operates on a scale from one to six stars, with six stars representing world leadership in sustainability. For most commercial and government projects, a minimum 5 Star Green Star rating is now expected, and many developers are targeting 6 Star ratings as a competitive differentiator.\n\nThe credit categories in Green Star cover a broad range of sustainability considerations: Energy, Water, Materials, Indoor Environment Quality, Transport, Land Use & Ecology, Emissions, Management, and Innovation. Each category contains specific credits that projects can target based on their design and construction approach.\n\nThe business case for Green Star certification is compelling. Research by the GBCA shows that Green Star-rated buildings command 5-12% higher rents, have 10-20% lower operating costs, and achieve 8-15% higher asset values compared to non-rated buildings. For construction companies, demonstrating Green Star experience is increasingly important for tender eligibility.",
      authorName: "Rachel Wong",
      tags: ["sustainability", "green-star", "certification", "trends"],
      heroImageUrl: HERO_IMAGES[1],
    },
    {
      title: "Safety Innovation: How Wearable Technology is Reducing Site Incidents",
      slug: "safety-innovation-wearable-technology-construction",
      excerpt: "Smart helmets, biometric monitors, and GPS tracking are transforming construction site safety across Australia, with early adopters reporting significant reductions in incidents.",
      body: "The Australian construction industry has long grappled with workplace safety challenges, with the sector consistently recording higher injury and fatality rates than most other industries. However, a new generation of wearable technology is providing construction companies with powerful tools to protect their workers and reduce incident rates.\n\nSmart helmets equipped with proximity sensors, environmental monitors, and heads-up displays are becoming standard equipment on leading construction sites. These devices can alert workers when they enter exclusion zones, detect dangerous gas concentrations, and provide real-time information about site hazards. Several Tier 1 contractors in Australia have reported 30-40% reductions in near-miss incidents since deploying smart helmet technology.\n\nBiometric monitoring wearables, worn as wristbands or integrated into PPE, track vital signs such as heart rate, body temperature, and fatigue indicators. These devices can identify workers at risk of heat stress — a particularly important application in Australia's climate — and alert supervisors before a health incident occurs.\n\nGPS and ultra-wideband (UWB) tracking systems provide real-time visibility of worker locations on large construction sites. This technology enables automated mustering in emergency situations and helps site managers understand movement patterns to optimise traffic management plans.",
      authorName: "Mark Thompson",
      tags: ["safety", "innovation", "technology", "wearables"],
      heroImageUrl: HERO_IMAGES[2],
    },
    {
      title: "Navigating the Construction Skills Shortage in 2025",
      slug: "navigating-construction-skills-shortage-2025",
      excerpt: "Australia's construction industry faces a critical skills shortage that threatens to delay major infrastructure projects. Here's what industry leaders are doing about it.",
      body: "The Australian construction industry is facing its most severe skills shortage in a generation. With a pipeline of over $250 billion in infrastructure and building projects, the industry needs an estimated 90,000 additional workers over the next five years. This shortfall spans trades, engineering disciplines, and project management roles.\n\nSeveral factors have converged to create this challenge. An ageing workforce is seeing experienced tradespeople retire faster than new apprentices can replace them. The COVID-19 pandemic disrupted training pipelines and reduced migration of skilled workers. Additionally, the simultaneous delivery of major infrastructure projects across multiple states is creating unprecedented demand for construction labour.\n\nIndustry leaders are responding with a range of strategies. Many companies are investing heavily in apprenticeship programmes, offering higher wages and better working conditions to attract young people into the trades. Some are partnering with TAFEs and universities to develop accelerated training programmes that can produce qualified workers more quickly.\n\nTechnology adoption is also playing a role in addressing the shortage. Prefabrication, modular construction, and robotic automation can reduce the labour required for certain tasks, effectively stretching the available workforce further. Building Information Modelling (BIM) and digital twins help projects run more efficiently, reducing rework and the associated labour waste.",
      authorName: "James O'Sullivan",
      tags: ["careers", "skills", "workforce", "trends"],
      heroImageUrl: HERO_IMAGES[3],
    },
    {
      title: "The Business Case for Digital Twins in Construction",
      slug: "business-case-digital-twins-construction",
      excerpt: "Digital twin technology is moving beyond buzzword status to deliver tangible benefits in construction project delivery, asset management, and building operations.",
      body: "Digital twins — dynamic virtual replicas of physical buildings and infrastructure assets — are transforming how the Australian construction industry designs, builds, and operates the built environment. While the concept has been discussed for years, recent advances in sensor technology, cloud computing, and artificial intelligence are making digital twins practically achievable and commercially viable.\n\nA construction digital twin goes beyond traditional 3D models or BIM by incorporating real-time data from sensors, IoT devices, and construction management systems. This creates a living model that reflects the current state of a project or building, enabling predictive analytics, scenario planning, and automated decision-making.\n\nDuring construction, digital twins enable project teams to compare actual progress against planned progress in real time, identify potential clashes or design issues before they become on-site problems, and optimise construction sequencing based on actual site conditions. Several Australian contractors report that digital twin adoption has reduced rework costs by 15-25% and improved schedule predictability.\n\nPost-construction, digital twins provide building owners and facility managers with powerful tools for managing building performance. By integrating data from building management systems, energy meters, and occupancy sensors, digital twins can optimise energy consumption, predict maintenance needs, and improve occupant comfort.",
      authorName: "Dr. Emily Chen",
      tags: ["innovation", "technology", "digital-twins", "trends"],
      heroImageUrl: HERO_IMAGES[4],
    },
    {
      title: "Women in Construction: Breaking Barriers in 2025",
      slug: "women-in-construction-breaking-barriers-2025",
      excerpt: "Female participation in Australia's construction industry is growing, driven by targeted programmes, culture change, and recognition of the business benefits of diversity.",
      body: "Women currently represent just 13% of Australia's construction workforce, and only 2% of on-site trade roles. While these numbers remain stubbornly low, there are encouraging signs of change, with female enrolments in construction-related university courses and apprenticeships reaching record levels in 2024.\n\nIndustry initiatives like the National Association of Women in Construction (NAWIC) mentoring programme, the Master Builders Australia female apprenticeship incentive, and company-level diversity targets are helping to attract and retain women in the industry. Several major contractors have set public targets of 30% female representation by 2030 and are implementing flexible work arrangements, improved site facilities, and anti-harassment policies to support this goal.\n\nThe business case for gender diversity in construction is well-established. Research consistently shows that diverse teams make better decisions, deliver higher-quality outcomes, and achieve better safety performance. Companies with greater gender diversity report 15-25% higher profitability and significantly lower staff turnover.\n\nLeading female construction professionals are also serving as powerful role models for the next generation. Project directors, site managers, engineers, and tradeswomen are sharing their stories through industry events, social media, and school outreach programmes, demonstrating that construction offers rewarding careers for women at all levels.",
      authorName: "Lisa Campbell",
      tags: ["careers", "diversity", "culture", "trends"],
      heroImageUrl: HERO_IMAGES[5],
    },
    {
      title: "Concrete Innovation: Low-Carbon Alternatives Gaining Ground",
      slug: "concrete-innovation-low-carbon-alternatives",
      excerpt: "Geopolymer concrete, carbon-capture cement, and recycled aggregates are reshaping the concrete industry as Australia pushes towards net-zero construction.",
      body: "Concrete is the most widely used construction material on Earth, but its production accounts for approximately 8% of global CO2 emissions. In Australia, where concrete is essential for everything from residential slabs to major infrastructure projects, the industry is investing heavily in low-carbon alternatives and process improvements.\n\nGeopolymer concrete, which replaces Portland cement with industrial by-products such as fly ash and blast furnace slag, can achieve 60-80% lower carbon emissions than conventional concrete. Several Australian infrastructure projects have successfully used geopolymer concrete for structural applications, demonstrating that performance standards can be maintained while dramatically reducing environmental impact.\n\nCarbon-capture cement technologies are also emerging, with companies developing processes that actually sequester CO2 during the cement manufacturing process. While these technologies are still at commercial pilot stage, early results suggest they could make cement production carbon-neutral or even carbon-negative within the next decade.\n\nRecycled concrete aggregates (RCA) are becoming increasingly common in Australian construction, with state road authorities and major developers specifying minimum recycled content in concrete mixes. Using RCA reduces the need for virgin quarried materials, diverts demolition waste from landfill, and can lower the overall embodied carbon of concrete structures.",
      authorName: "Prof. David Wright",
      tags: ["sustainability", "innovation", "concrete", "materials"],
      heroImageUrl: HERO_IMAGES[6],
    },
    {
      title: "Modular Construction: From Niche to Mainstream",
      slug: "modular-construction-niche-to-mainstream",
      excerpt: "Modular and prefabricated construction methods are gaining mainstream acceptance in Australia, offering faster delivery times, better quality control, and reduced waste.",
      body: "Modular construction — where building components or entire rooms are manufactured off-site in factory conditions and assembled on-site — is experiencing rapid growth in Australia. Market analysts estimate that the Australian modular construction market will grow by 15-20% annually through 2030, driven by housing affordability pressures, skills shortages, and sustainability targets.\n\nThe advantages of modular construction are compelling. Factory manufacturing can reduce construction timelines by 30-50%, as site preparation and module fabrication occur simultaneously. Quality control in a factory environment is inherently more consistent than on-site construction, resulting in fewer defects and lower maintenance costs over the building's lifecycle.\n\nSeveral landmark modular projects in Australia are demonstrating the method's potential. A 30-storey residential tower in Melbourne was assembled from prefabricated bathroom and bedroom pods, achieving a construction rate of one floor per week. In regional Australia, modular health clinics are being deployed to remote communities that would otherwise wait years for permanent healthcare facilities.\n\nThe environmental benefits of modular construction are also significant. Factory manufacturing generates 50-70% less waste than traditional construction, and the controlled environment enables better material utilisation and recycling. Modular buildings can be designed for disassembly at end-of-life, supporting circular economy principles.",
      authorName: "Anna Richardson",
      tags: ["innovation", "modular", "prefabrication", "trends"],
      heroImageUrl: HERO_IMAGES[7],
    },
    {
      title: "Construction Contract Essentials Every Builder Should Know",
      slug: "construction-contract-essentials-builders",
      excerpt: "Understanding construction contracts is critical for builders and subcontractors. This guide covers the key clauses, risk allocation principles, and common pitfalls to avoid.",
      body: "Construction contracts are among the most complex commercial agreements in any industry. For builders and subcontractors, understanding the key provisions of construction contracts is essential for managing risk, protecting cash flow, and maintaining profitable operations.\n\nThe most commonly used standard form contracts in Australia are AS 4000 (general conditions for head contracts), AS 4902 (design and construct), and AS 4301 (subcontracts). These standard forms provide a balanced allocation of risk between the parties, but they are frequently amended by principals and head contractors to shift risk down the contracting chain.\n\nKey clauses that every builder and subcontractor should understand include: variations (how changes to the work are valued and administered), time extensions (the process for claiming additional time when delays occur), liquidated damages (the financial penalties for late completion), payment terms and security of payment rights under the relevant state legislation, and defects liability provisions.\n\nCash flow management is critical in construction contracting. The Building and Construction Industry Security of Payment Act provides important protections for contractors and subcontractors, including the right to regular progress payments, the ability to make adjudication claims for disputed payments, and restrictions on 'pay when paid' clauses.",
      authorName: "Michael Ward, Barrister",
      tags: ["contracts", "legal", "business", "education"],
      heroImageUrl: HERO_IMAGES[8],
    },
    {
      title: "Building Information Modelling: Best Practices for Australian Projects",
      slug: "bim-best-practices-australian-projects",
      excerpt: "BIM adoption in Australia has reached a tipping point. Here are the best practices for implementing BIM effectively across design, construction, and operations phases.",
      body: "Building Information Modelling (BIM) has moved from being a competitive advantage to a baseline requirement for most significant construction projects in Australia. Government clients at federal and state level are increasingly mandating BIM on public projects, and private sector clients are following suit as they recognise the benefits of model-based project delivery.\n\nEffective BIM implementation requires more than simply creating 3D models. It demands a systematic approach to information management, clear protocols for model sharing and coordination, and investment in training and technology. The key best practices for Australian construction projects include establishing a BIM Execution Plan (BEP) at project inception, defining Level of Development (LOD) requirements for each project phase, and implementing regular model coordination and clash detection processes.\n\nFor contractors, the greatest value from BIM comes during the construction phase. 4D BIM (linking the model to the construction programme) enables visual construction sequencing and progress tracking. 5D BIM (adding cost data) supports quantity takeoff and cost planning. These applications can reduce rework by 20-30% and improve estimating accuracy by 15-20%.\n\nLooking ahead, the integration of BIM with other digital technologies — including digital twins, IoT sensors, and artificial intelligence — will create even more powerful tools for construction project delivery and building operations management.",
      authorName: "Timothy Lee, BIM Manager",
      tags: ["innovation", "technology", "BIM", "trends"],
      heroImageUrl: HERO_IMAGES[9],
    },
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        heroImageUrl: article.heroImageUrl,
        authorName: article.authorName,
        status: "PUBLISHED",
        tags: article.tags,
        publishedAt: new Date(2025, randomInt(0, 11), randomInt(1, 28)),
      },
    });
  }
  console.log(`${articles.length} articles created.`);

  // ── Create Case Study Links ──────────────────────────

  console.log("Creating case study links...");
  let caseStudyCount = 0;

  // Pick projects from builder and consultant companies for case studies
  const caseStudyCandidateProjects = allProjects.filter(
    p => ["tier1", "midtier", "consultant"].includes(p.companyType)
  );

  const caseStudyProjects = pickN(caseStudyCandidateProjects, 15);

  for (const proj of caseStudyProjects) {
    // Link to the owning company
    const owningCompany = companyRecords[proj.companySlug];

    await prisma.projectCaseStudy.create({
      data: {
        projectId: proj.id,
        companyId: owningCompany.id,
        title: `${owningCompany.name} Case Study: ${proj.title}`,
        url: `/projects/${slugify(proj.title)}-case-study`,
        description: `Detailed case study of how ${owningCompany.name} delivered the ${proj.title} project, covering challenges, innovations, and outcomes.`,
      },
    });
    caseStudyCount++;
  }
  console.log(`${caseStudyCount} case study links created.`);

  // ── Summary ──────────────────────────────────────────

  console.log("\n══════════════════════════════════════");
  console.log("Seed completed successfully!");
  console.log("══════════════════════════════════════");
  console.log(`Companies:         ${Object.keys(companyRecords).length}`);
  console.log(`Projects:          ${allProjects.length}`);
  console.log(`Stakeholders:      ${stakeholderCount}`);
  console.log(`Media items:       ${allMediaData.length}`);
  console.log(`Credits:           ${creditCount}`);
  console.log(`Personal profiles: ${personCount}`);
  console.log(`Articles:          ${articles.length}`);
  console.log(`Case study links:  ${caseStudyCount}`);
  console.log("══════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
