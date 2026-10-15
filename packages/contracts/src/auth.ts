// Login, hospital selection and session payloads (UC-ACC-01, ADR-004, ADR-021).
import { z } from 'zod';

export const loginRequestSchema = z.object({
  username: z.string().trim().min(1).max(100),
  // The upper bound stops oversized inputs from reaching argon2 (CPU exhaustion).
  password: z.string().min(1).max(1024),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const selectMembershipRequestSchema = z.object({ membershipId: z.uuid() });
export type SelectMembershipRequest = z.infer<typeof selectMembershipRequestSchema>;

export const membershipSummarySchema = z.object({
  id: z.uuid(),
  tenantId: z.uuid(),
  tenantNameEn: z.string().nullable(),
  tenantNameBn: z.string().nullable(),
});
export type MembershipSummary = z.infer<typeof membershipSummarySchema>;

export const sessionResponseSchema = z.object({
  user: z.object({
    id: z.uuid(),
    displayName: z.string(),
    preferredLang: z.enum(['bn-BD', 'en']),
  }),
  memberships: z.array(membershipSummarySchema),
  activeMembershipId: z.uuid().nullable(),
  csrfToken: z.string().min(1),
  idleExpiresAt: z.iso.datetime(),
  absoluteExpiresAt: z.iso.datetime(),
});
export type SessionResponse = z.infer<typeof sessionResponseSchema>;

// FR-I18N-001: the interface language is a per-user preference stored on the server.
export const updatePreferencesRequestSchema = z.object({
  preferredLang: z.enum(['bn-BD', 'en']),
});
export type UpdatePreferencesRequest = z.infer<typeof updatePreferencesRequestSchema>;
