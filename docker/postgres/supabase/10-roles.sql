-- Supabase setup: same role model as docker/postgres/initdb/10-roles.sql (ADR-003, ADR-019).
-- Run once per Supabase project as the `postgres` user, passing passwords as psql variables:
--   psql "$SUPABASE_ADMIN_URL" -v migrator_pw=... -v app_pw=... -f docker/postgres/supabase/10-roles.sql
-- Passwords are never stored in this file.
\set ON_ERROR_STOP on

CREATE ROLE hms_migrator LOGIN NOBYPASSRLS PASSWORD :'migrator_pw';
CREATE ROLE hms_app LOGIN NOBYPASSRLS PASSWORD :'app_pw';

-- Lets `postgres` create objects owned by hms_migrator and set its default privileges.
GRANT hms_migrator TO postgres;

CREATE SCHEMA hms AUTHORIZATION hms_migrator;
GRANT USAGE ON SCHEMA hms TO hms_app;

ALTER DEFAULT PRIVILEGES FOR ROLE hms_migrator IN SCHEMA hms
  GRANT SELECT, INSERT, UPDATE ON TABLES TO hms_app;
ALTER DEFAULT PRIVILEGES FOR ROLE hms_migrator IN SCHEMA hms
  GRANT USAGE, SELECT ON SEQUENCES TO hms_app;

-- Supabase API roles get nothing in the hms schema, even if the Data API is misconfigured.
REVOKE ALL ON SCHEMA hms FROM anon, authenticated, PUBLIC;
