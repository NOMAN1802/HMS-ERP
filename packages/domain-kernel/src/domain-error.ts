// An expected business failure with a stable contract code (C00 section 9). The HTTP layer
// turns it into problem+json; anything that is not a DomainError is an unexpected 500.
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
