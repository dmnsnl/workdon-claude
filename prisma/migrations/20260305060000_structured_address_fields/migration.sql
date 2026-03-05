-- Step 1: Add new columns to projects
ALTER TABLE "projects" ADD COLUMN "street_address" TEXT;
ALTER TABLE "projects" ADD COLUMN "suburb" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "state" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "postcode" TEXT;
ALTER TABLE "projects" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'AU';
ALTER TABLE "projects" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "projects" ADD COLUMN "longitude" DOUBLE PRECISION;

-- Step 2: Add new columns to companies
ALTER TABLE "companies" ADD COLUMN "street_address" TEXT;
ALTER TABLE "companies" ADD COLUMN "suburb" TEXT;
ALTER TABLE "companies" ADD COLUMN "state" TEXT;
ALTER TABLE "companies" ADD COLUMN "postcode" TEXT;
ALTER TABLE "companies" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'AU';
ALTER TABLE "companies" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "companies" ADD COLUMN "longitude" DOUBLE PRECISION;

-- Step 3: Migrate project location data — AU states
UPDATE "projects" SET
  "suburb" = split_part("location", ', ', 1),
  "state" = split_part("location", ', ', 2),
  "country" = 'AU'
WHERE "location" IS NOT NULL
  AND "location" != ''
  AND split_part("location", ', ', 2) IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');

-- Step 4: Migrate project location data — Non-AU
UPDATE "projects" SET
  "suburb" = split_part("location", ', ', 1),
  "state" = '',
  "country" = split_part("location", ', ', 2)
WHERE "location" IS NOT NULL
  AND "location" != ''
  AND split_part("location", ', ', 2) NOT IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT')
  AND "suburb" = '';

-- Step 5: Migrate company location data — AU states
UPDATE "companies" SET
  "suburb" = split_part("location", ', ', 1),
  "state" = split_part("location", ', ', 2),
  "country" = 'AU'
WHERE "location" IS NOT NULL
  AND "location" != ''
  AND split_part("location", ', ', 2) IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');

-- Step 6: Migrate company location data — Non-AU
UPDATE "companies" SET
  "suburb" = split_part("location", ', ', 1),
  "state" = '',
  "country" = split_part("location", ', ', 2)
WHERE "location" IS NOT NULL
  AND "location" != ''
  AND split_part("location", ', ', 2) NOT IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT')
  AND "suburb" IS NULL;

-- Step 7: Drop old location columns
ALTER TABLE "projects" DROP COLUMN "location";
ALTER TABLE "companies" DROP COLUMN "location";

-- Step 8: Add indexes
CREATE INDEX "projects_suburb_idx" ON "projects"("suburb");
CREATE INDEX "projects_country_idx" ON "projects"("country");
CREATE INDEX "companies_suburb_idx" ON "companies"("suburb");
