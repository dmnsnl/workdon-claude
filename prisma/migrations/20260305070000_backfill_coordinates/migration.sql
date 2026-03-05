-- Backfill latitude/longitude for projects based on suburb
UPDATE "projects" SET "latitude" = -33.8688, "longitude" = 151.2093 WHERE "suburb" = 'Sydney' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -37.8136, "longitude" = 144.9631 WHERE "suburb" = 'Melbourne' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -27.4705, "longitude" = 153.0260 WHERE "suburb" = 'Brisbane' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -31.9505, "longitude" = 115.8605 WHERE "suburb" = 'Perth' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -34.9285, "longitude" = 138.6007 WHERE "suburb" = 'Adelaide' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -28.0167, "longitude" = 153.4000 WHERE "suburb" = 'Gold Coast' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -42.8821, "longitude" = 147.3272 WHERE "suburb" = 'Hobart' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -35.2809, "longitude" = 149.1300 WHERE "suburb" = 'Canberra' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -36.8485, "longitude" = 174.7633 WHERE "suburb" = 'Auckland' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = -41.2924, "longitude" = 174.7787 WHERE "suburb" = 'Wellington' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = 51.5074, "longitude" = -0.1278 WHERE "suburb" = 'London' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = 53.4808, "longitude" = -2.2426 WHERE "suburb" = 'Manchester' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = 34.0522, "longitude" = -118.2437 WHERE "suburb" = 'Los Angeles' AND "latitude" IS NULL;
UPDATE "projects" SET "latitude" = 40.7128, "longitude" = -74.0060 WHERE "suburb" = 'New York' AND "latitude" IS NULL;

-- Backfill latitude/longitude for companies based on suburb
UPDATE "companies" SET "latitude" = -33.8688, "longitude" = 151.2093 WHERE "suburb" = 'Sydney' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -37.8136, "longitude" = 144.9631 WHERE "suburb" = 'Melbourne' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -27.4705, "longitude" = 153.0260 WHERE "suburb" = 'Brisbane' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -31.9505, "longitude" = 115.8605 WHERE "suburb" = 'Perth' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -34.9285, "longitude" = 138.6007 WHERE "suburb" = 'Adelaide' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -28.0167, "longitude" = 153.4000 WHERE "suburb" = 'Gold Coast' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -42.8821, "longitude" = 147.3272 WHERE "suburb" = 'Hobart' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -35.2809, "longitude" = 149.1300 WHERE "suburb" = 'Canberra' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -36.8485, "longitude" = 174.7633 WHERE "suburb" = 'Auckland' AND "latitude" IS NULL;
UPDATE "companies" SET "latitude" = -41.2924, "longitude" = 174.7787 WHERE "suburb" = 'Wellington' AND "latitude" IS NULL;
