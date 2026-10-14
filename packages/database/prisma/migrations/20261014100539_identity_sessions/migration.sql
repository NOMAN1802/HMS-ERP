-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'LOCKED_TEMPORARY', 'LOCKED_ADMIN', 'DISABLED');

-- CreateEnum
CREATE TYPE "PreferredLang" AS ENUM ('bn-BD', 'en');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "EventOutcome" AS ENUM ('SUCCEEDED', 'DENIED', 'FAILED');

-- CreateTable
CREATE TABLE "user_account" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ,
    "lock_reason" TEXT,
    "preferred_lang" "PreferredLang" NOT NULL DEFAULT 'bn-BD',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership" (
    "tenant_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_session" (
    "token_hash" BYTEA NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID,
    "membership_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idle_expires_at" TIMESTAMPTZ NOT NULL,
    "absolute_expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,

    CONSTRAINT "user_session_pkey" PRIMARY KEY ("token_hash")
);

-- CreateTable
CREATE TABLE "auth_event" (
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "outcome" "EventOutcome" NOT NULL,
    "user_id" UUID,
    "username_attempted" TEXT,
    "reason" TEXT,
    "ip_address" TEXT,
    "correlation_id" TEXT,

    CONSTRAINT "auth_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_event" (
    "tenant_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_user_id" UUID,
    "membership_id" UUID,
    "action" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" UUID,
    "outcome" "EventOutcome" NOT NULL,
    "reason" TEXT,
    "correlation_id" TEXT,
    "details" JSONB,

    CONSTRAINT "audit_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_username_key" ON "user_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "membership_tenant_id_id_key" ON "membership"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "membership_tenant_id_user_id_key" ON "membership"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "user_session_user_id_idx" ON "user_session"("user_id");

-- CreateIndex
CREATE INDEX "auth_event_user_id_occurred_at_idx" ON "auth_event"("user_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_event_tenant_id_actor_user_id_occurred_at_idx" ON "audit_event"("tenant_id", "actor_user_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_event_tenant_id_target_type_target_id_occurred_at_idx" ON "audit_event"("tenant_id", "target_type", "target_id", "occurred_at");

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_tenant_id_membership_id_fkey" FOREIGN KEY ("tenant_id", "membership_id") REFERENCES "membership"("tenant_id", "id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================================
-- Hand-written: rules Prisma does not model (T-ACC-01, ADR-003, ADR-009).
-- ============================================================================

-- Usernames are compared case-insensitively by storing them lower-case.
ALTER TABLE hms.user_account
  ADD CONSTRAINT user_account_username_lowercase CHECK (username = lower(username));

-- Memberships: visible in the current hospital, or (before a hospital is chosen) to their own
-- user, so the login screen can list the user's hospitals. Writes need the hospital context.
ALTER TABLE hms.membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE hms.membership FORCE ROW LEVEL SECURITY;
CREATE POLICY membership_tenant_or_own ON hms.membership
  USING (tenant_id = hms.current_tenant_id() OR user_id = hms.current_app_user_id())
  WITH CHECK (tenant_id = hms.current_tenant_id());

-- A user may read the name of any hospital they belong to (hospital selection at login).
CREATE POLICY tenant_member_read ON hms.tenant FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM hms.membership m
    WHERE m.tenant_id = tenant.id AND m.user_id = hms.current_app_user_id()));

-- Tenant audit trail: normal tenant isolation.
ALTER TABLE hms.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE hms.audit_event FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hms.audit_event
  USING (tenant_id = hms.current_tenant_id())
  WITH CHECK (tenant_id = hms.current_tenant_id());

-- Append-only event tables (ADR-009): no UPDATE for the application role.
REVOKE UPDATE ON hms.audit_event, hms.auth_event FROM hms_app;

-- Sessions are deleted by the cleanup job (later) and at logout housekeeping.
GRANT DELETE ON hms.user_session TO hms_app;
