-- Hardening from the T-ACC-01 security review (ADR-003).

-- A user may READ their own memberships in any hospital (login screen), but may WRITE only in
-- the current hospital. With one combined policy, the "own" branch let a row from another
-- hospital pass USING and then be moved into the current hospital by UPDATE.
DROP POLICY membership_tenant_or_own ON hms.membership;
CREATE POLICY membership_tenant ON hms.membership
  USING (tenant_id = hms.current_tenant_id())
  WITH CHECK (tenant_id = hms.current_tenant_id());
CREATE POLICY membership_own_read ON hms.membership FOR SELECT
  USING (user_id = hms.current_app_user_id());

-- A user may read the name only of hospitals where their membership is ACTIVE; invited,
-- suspended or revoked hospitals stay hidden.
DROP POLICY tenant_member_read ON hms.tenant;
CREATE POLICY tenant_member_read ON hms.tenant FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM hms.membership m
    WHERE m.tenant_id = tenant.id
      AND m.user_id = hms.current_app_user_id()
      AND m.status = 'ACTIVE'));
