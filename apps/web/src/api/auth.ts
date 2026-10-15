// The auth endpoints the web app uses (UC-ACC-01, FR-I18N-001). Each answer is a SessionResponse
// validated against the shared contract.
import { type LoginRequest, type SessionResponse, sessionResponseSchema } from '@hms/contracts';
import { apiRequest } from './client';

const parse = (data: unknown): SessionResponse => sessionResponseSchema.parse(data);

export const authApi = {
  login: (body: LoginRequest) => apiRequest('/auth/login', { method: 'POST', body, parse }),
  session: () => apiRequest('/auth/session', { parse }),
  selectMembership: (membershipId: string) =>
    apiRequest('/auth/session/membership', { method: 'POST', body: { membershipId }, parse }),
  updatePreferences: (preferredLang: 'bn-BD' | 'en') =>
    apiRequest('/auth/preferences', { method: 'PATCH', body: { preferredLang }, parse }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};
