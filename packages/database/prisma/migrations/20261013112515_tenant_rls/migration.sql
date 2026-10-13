-- CreateTable
CREATE TABLE "facility" (
    "tenant_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name_en" TEXT,
    "name_bn" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "tenant_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name_en" TEXT,
    "name_bn" TEXT,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facility_tenant_id_id_key" ON "facility"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "facility_tenant_id_code_key" ON "facility"("tenant_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "department_tenant_id_id_key" ON "department"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "department_tenant_id_facility_id_code_key" ON "department"("tenant_id", "facility_id", "code");

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_tenant_id_facility_id_fkey" FOREIGN KEY ("tenant_id", "facility_id") REFERENCES "facility"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================================
-- Row-level security (ADR-003, E §6.2). Hand-written; Prisma does not model RLS.
-- The tenant comes from a transaction-local setting written by withTenant().
-- An unset context reads as '' -> NULL -> matches no rows (fail-closed).
-- ============================================================================
CREATE FUNCTION hms.current_tenant_id() RETURNS uuid LANGUAGE sql STABLE AS
$$ SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid $$;

CREATE FUNCTION hms.current_app_user_id() RETURNS uuid LANGUAGE sql STABLE AS
$$ SELECT NULLIF(current_setting('app.user_id', true), '')::uuid $$;

GRANT EXECUTE ON FUNCTION hms.current_tenant_id(), hms.current_app_user_id() TO hms_app;

-- tenant: a session sees only its own tenant row.
ALTER TABLE hms.tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE hms.tenant FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_self ON hms.tenant
  USING (id = hms.current_tenant_id())
  WITH CHECK (id = hms.current_tenant_id());

-- Tenant-owned tables: FORCE makes the policy apply to the table owner too.
ALTER TABLE hms.facility ENABLE ROW LEVEL SECURITY;
ALTER TABLE hms.facility FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hms.facility
  USING (tenant_id = hms.current_tenant_id())
  WITH CHECK (tenant_id = hms.current_tenant_id());

ALTER TABLE hms.department ENABLE ROW LEVEL SECURITY;
ALTER TABLE hms.department FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hms.department
  USING (tenant_id = hms.current_tenant_id())
  WITH CHECK (tenant_id = hms.current_tenant_id());
