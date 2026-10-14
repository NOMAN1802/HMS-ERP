-- Sessions are revoked for good at the moment access is removed (FR-ACC-010, ADR-004).
-- Doing it in the database covers every code path (admin screens, jobs, manual SQL), and a
-- later restore of access cannot revive an old or stolen cookie: the user must log in again.

CREATE FUNCTION hms.revoke_sessions_of_user() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE hms.user_session
     SET revoked_at = now()
   WHERE user_id = NEW.id AND revoked_at IS NULL;
  RETURN NEW;
END $$;

CREATE TRIGGER user_account_access_removed
  AFTER UPDATE OF status ON hms.user_account
  FOR EACH ROW
  WHEN (NEW.status <> 'ACTIVE' AND NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION hms.revoke_sessions_of_user();

CREATE FUNCTION hms.revoke_sessions_of_membership() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE hms.user_session
     SET revoked_at = now()
   WHERE tenant_id = NEW.tenant_id AND membership_id = NEW.id AND revoked_at IS NULL;
  RETURN NEW;
END $$;

CREATE TRIGGER membership_access_removed
  AFTER UPDATE OF status ON hms.membership
  FOR EACH ROW
  WHEN (NEW.status <> 'ACTIVE' AND NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION hms.revoke_sessions_of_membership();
