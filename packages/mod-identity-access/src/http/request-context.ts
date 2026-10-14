// The authenticated session attached to each request by SessionGuard.
import type { Request } from 'express';
import { DomainError } from '@hms/domain-kernel';
import type { AuthContext } from '../application/auth.service.js';

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
  sessionToken?: string;
}

export function getAuthContext(request: AuthenticatedRequest): AuthContext {
  if (!request.auth) throw new DomainError('UNAUTHENTICATED', 'Login required');
  return request.auth;
}

export function getSessionToken(request: AuthenticatedRequest): string {
  if (!request.sessionToken) throw new DomainError('UNAUTHENTICATED', 'Login required');
  return request.sessionToken;
}
