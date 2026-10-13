-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PROVISIONING', 'PROVISIONED', 'ACTIVE', 'SUSPENDED', 'TERMINATED');

-- CreateTable
CREATE TABLE "tenant" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name_en" TEXT,
    "name_bn" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'PROVISIONED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_code_key" ON "tenant"("code");
