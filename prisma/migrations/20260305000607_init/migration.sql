-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'STANDARD');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('COMPANY', 'PERSONAL');

-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('OWNER', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PUBLIC', 'INTERNAL');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'UNLISTED');

-- CreateEnum
CREATE TYPE "ProfileTemplate" AS ENUM ('TEMPLATE_A', 'TEMPLATE_B', 'TEMPLATE_C');

-- CreateEnum
CREATE TYPE "ProfileItemType" AS ENUM ('SERVICE', 'PROJECT');

-- CreateEnum
CREATE TYPE "StakeholderRole" AS ENUM ('CLIENT', 'ARCHITECT', 'BUILDER', 'ENGINEER', 'CONSTRUCTION_MANAGER', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "CreditRoleCategory" AS ENUM ('CONSTRUCTION_MANAGER', 'ARCHITECT', 'BUILDER', 'ENGINEER', 'SUBCONTRACTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "CreditEntityType" AS ENUM ('PERSON', 'BUSINESS');

-- CreateEnum
CREATE TYPE "BudgetBand" AS ENUM ('UNDER_1M', 'FROM_1M_TO_10M', 'FROM_10M_TO_50M', 'OVER_50M');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account_type" "AccountType" NOT NULL,
    "company_id" TEXT,
    "company_role" "CompanyRole",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "location" TEXT,
    "primary_color" TEXT NOT NULL DEFAULT '#0f172a',
    "plan_tier" "PlanTier" NOT NULL DEFAULT 'FREE',
    "sectors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "trades" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publish_status" "PublishStatus" NOT NULL DEFAULT 'INTERNAL',
    "is_confidential" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "client" TEXT,
    "location" TEXT NOT NULL,
    "sector_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completion_year" INTEGER NOT NULL,
    "budget_band" "BudgetBand" NOT NULL DEFAULT 'FROM_1M_TO_10M',
    "scope_summary" TEXT NOT NULL,
    "case_study" TEXT,
    "hero_image_url" TEXT,
    "publish_status" "PublishStatus" NOT NULL DEFAULT 'INTERNAL',
    "is_confidential" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_stakeholders" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" "StakeholderRole" NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_media" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "media_type" "ProjectMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_credits" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role_category" "CreditRoleCategory" NOT NULL,
    "trade_group" TEXT,
    "entity_type" "CreditEntityType" NOT NULL,
    "entity_name" TEXT NOT NULL,
    "linked_company_slug" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_profiles" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "intro_text" TEXT NOT NULL DEFAULT '',
    "visibility" "ProfileVisibility" NOT NULL DEFAULT 'UNLISTED',
    "include_confidential" BOOLEAN NOT NULL DEFAULT false,
    "template" "ProfileTemplate" NOT NULL DEFAULT 'TEMPLATE_A',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capability_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_profile_items" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "item_type" "ProfileItemType" NOT NULL,
    "service_id" TEXT,
    "project_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "capability_profile_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',
    "role_title" TEXT,
    "location" TEXT,
    "years_experience" INTEGER NOT NULL DEFAULT 0,
    "education" TEXT,
    "certificates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "profile_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_experiences" (
    "id" TEXT NOT NULL,
    "personal_profile_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "linked_company_id" TEXT,
    "role_title" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_project_experiences" (
    "id" TEXT NOT NULL,
    "personal_profile_id" TEXT NOT NULL,
    "project_id" TEXT,
    "project_name" TEXT NOT NULL,
    "role_title" TEXT NOT NULL DEFAULT '',
    "contribution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_project_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_company_id_idx" ON "users"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "services_company_id_publish_status_is_confidential_idx" ON "services"("company_id", "publish_status", "is_confidential");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_company_id_publish_status_is_confidential_idx" ON "projects"("company_id", "publish_status", "is_confidential");

-- CreateIndex
CREATE INDEX "project_stakeholders_project_id_role_idx" ON "project_stakeholders"("project_id", "role");

-- CreateIndex
CREATE INDEX "project_media_project_id_idx" ON "project_media"("project_id");

-- CreateIndex
CREATE INDEX "project_credits_project_id_role_category_sort_order_idx" ON "project_credits"("project_id", "role_category", "sort_order");

-- CreateIndex
CREATE INDEX "project_credits_linked_company_slug_idx" ON "project_credits"("linked_company_slug");

-- CreateIndex
CREATE UNIQUE INDEX "capability_profiles_slug_key" ON "capability_profiles"("slug");

-- CreateIndex
CREATE INDEX "capability_profiles_company_id_idx" ON "capability_profiles"("company_id");

-- CreateIndex
CREATE INDEX "capability_profile_items_profile_id_sort_order_idx" ON "capability_profile_items"("profile_id", "sort_order");

-- CreateIndex
CREATE INDEX "capability_profile_items_service_id_idx" ON "capability_profile_items"("service_id");

-- CreateIndex
CREATE INDEX "capability_profile_items_project_id_idx" ON "capability_profile_items"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_profiles_user_id_key" ON "personal_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_profiles_slug_key" ON "personal_profiles"("slug");

-- CreateIndex
CREATE INDEX "role_experiences_personal_profile_id_idx" ON "role_experiences"("personal_profile_id");

-- CreateIndex
CREATE INDEX "role_experiences_linked_company_id_idx" ON "role_experiences"("linked_company_id");

-- CreateIndex
CREATE INDEX "personal_project_experiences_personal_profile_id_idx" ON "personal_project_experiences"("personal_profile_id");

-- CreateIndex
CREATE INDEX "personal_project_experiences_project_id_idx" ON "personal_project_experiences"("project_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stakeholders" ADD CONSTRAINT "project_stakeholders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_credits" ADD CONSTRAINT "project_credits_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_profiles" ADD CONSTRAINT "capability_profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_profile_items" ADD CONSTRAINT "capability_profile_items_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "capability_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_profile_items" ADD CONSTRAINT "capability_profile_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_profile_items" ADD CONSTRAINT "capability_profile_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_profiles" ADD CONSTRAINT "personal_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_experiences" ADD CONSTRAINT "role_experiences_personal_profile_id_fkey" FOREIGN KEY ("personal_profile_id") REFERENCES "personal_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_experiences" ADD CONSTRAINT "role_experiences_linked_company_id_fkey" FOREIGN KEY ("linked_company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_project_experiences" ADD CONSTRAINT "personal_project_experiences_personal_profile_id_fkey" FOREIGN KEY ("personal_profile_id") REFERENCES "personal_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_project_experiences" ADD CONSTRAINT "personal_project_experiences_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
